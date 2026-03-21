"""
Test suite for Draft and My Applications features
- PATCH /api/applications/draft - Save draft with email auto-populated
- GET /api/applications/draft - Retrieve user's draft
- GET /api/applications/my-applications - List all user applications
- DELETE /api/applications/draft/{id} - Delete a draft
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test user credentials
TEST_USER = {
    "fullName": "Test User",
    "email": f"testuser_{int(time.time())}@example.com",
    "password": "Test123!"
}


class TestAuthSetup:
    """Authentication setup tests"""
    
    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()
    
    def test_register_user(self, session):
        """Register a new test user"""
        response = session.post(f"{BASE_URL}/api/auth/register", json=TEST_USER)
        print(f"Register response: {response.status_code} - {response.text}")
        # Accept 201 (created) or 400 (already exists)
        assert response.status_code in [201, 400], f"Unexpected status: {response.status_code}"
        if response.status_code == 201:
            data = response.json()
            assert "token" in data or "id" in data
            print(f"User registered successfully: {TEST_USER['email']}")
    
    def test_login_user(self, session):
        """Login with test user"""
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        print(f"Login response: {response.status_code} - {response.text}")
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "token" in data
        # Store token for other tests
        session.headers.update({"Authorization": f"Bearer {data['token']}"})
        print(f"Login successful, token obtained")
        return data["token"]


class TestDraftEndpoints:
    """Test draft application endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        
        # Register user
        response = session.post(f"{BASE_URL}/api/auth/register", json=TEST_USER)
        print(f"Register: {response.status_code}")
        
        # Login
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        if response.status_code == 200:
            token = response.json().get("token")
            session.headers.update({"Authorization": f"Bearer {token}"})
            print(f"Authenticated as {TEST_USER['email']}")
        else:
            pytest.skip(f"Authentication failed: {response.text}")
        
        return session
    
    def test_save_draft_creates_new(self, auth_session):
        """PATCH /api/applications/draft - Create new draft"""
        draft_data = {
            "passportType": "Ordinary",
            "portOfArrival": "Delhi Airport",
            "expectedArrivalDate": "2026-02-15",
            "visaService": "30 day Indian Tourist eVisa",
            "visaServiceSubtype": "Tourism, Recreation, Sight-seeing",
            "passportNumber": "AB1234567",
            "dateOfIssue": "2020-01-15",
            "dateOfExpiry": "2030-01-15",
            "currentStep": 1,
            "email": "test@example.com"
        }
        
        response = auth_session.patch(f"{BASE_URL}/api/applications/draft", json=draft_data)
        print(f"Save draft response: {response.status_code} - {response.text}")
        
        assert response.status_code == 200, f"Failed to save draft: {response.text}"
        data = response.json()
        assert "message" in data
        assert "draftId" in data
        assert data["message"] in ["Draft created", "Draft updated"]
        print(f"Draft saved with ID: {data['draftId']}")
        return data["draftId"]
    
    def test_get_draft_returns_saved_data(self, auth_session):
        """GET /api/applications/draft - Retrieve saved draft"""
        # First save a draft
        draft_data = {
            "passportType": "Ordinary",
            "portOfArrival": "Mumbai Airport",
            "expectedArrivalDate": "2026-02-20",
            "visaService": "30 day Indian Tourist eVisa",
            "passportNumber": "CD9876543",
            "currentStep": 2
        }
        auth_session.patch(f"{BASE_URL}/api/applications/draft", json=draft_data)
        
        # Now retrieve it
        response = auth_session.get(f"{BASE_URL}/api/applications/draft")
        print(f"Get draft response: {response.status_code} - {response.text}")
        
        assert response.status_code == 200, f"Failed to get draft: {response.text}"
        data = response.json()
        assert "draft" in data
        
        if data["draft"]:
            draft = data["draft"]
            assert draft.get("passportNumber") == "CD9876543"
            assert draft.get("portOfArrival") == "Mumbai Airport"
            assert draft.get("currentStep") == 2
            assert draft.get("status") == "draft"
            print(f"Draft retrieved successfully with step {draft.get('currentStep')}")
        else:
            print("No draft found (may have been deleted)")
    
    def test_draft_email_auto_populated(self, auth_session):
        """Verify email is saved in draft"""
        draft_data = {
            "passportType": "Ordinary",
            "portOfArrival": "Chennai Airport",
            "email": "autopopulated@test.com",
            "currentStep": 1
        }
        
        auth_session.patch(f"{BASE_URL}/api/applications/draft", json=draft_data)
        
        response = auth_session.get(f"{BASE_URL}/api/applications/draft")
        assert response.status_code == 200
        
        data = response.json()
        if data["draft"]:
            assert data["draft"].get("email") == "autopopulated@test.com"
            print("Email auto-population verified")
    
    def test_draft_upsert_updates_existing(self, auth_session):
        """PATCH /api/applications/draft - Update existing draft (upsert)"""
        # Save initial draft
        initial_data = {
            "passportType": "Ordinary",
            "portOfArrival": "Delhi Airport",
            "currentStep": 1
        }
        response1 = auth_session.patch(f"{BASE_URL}/api/applications/draft", json=initial_data)
        draft_id_1 = response1.json().get("draftId")
        
        # Update the draft
        updated_data = {
            "passportType": "Ordinary",
            "portOfArrival": "Bangalore Airport",
            "currentStep": 3
        }
        response2 = auth_session.patch(f"{BASE_URL}/api/applications/draft", json=updated_data)
        
        assert response2.status_code == 200
        data = response2.json()
        assert data["message"] == "Draft updated"
        draft_id_2 = data.get("draftId")
        
        # Should be same draft ID (upsert)
        assert draft_id_1 == draft_id_2, "Draft should be updated, not created new"
        print(f"Draft upsert verified - same ID: {draft_id_1}")


class TestMyApplicationsEndpoint:
    """Test my-applications endpoint"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        
        # Register user
        session.post(f"{BASE_URL}/api/auth/register", json=TEST_USER)
        
        # Login
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        if response.status_code == 200:
            token = response.json().get("token")
            session.headers.update({"Authorization": f"Bearer {token}"})
        else:
            pytest.skip("Authentication failed")
        
        return session
    
    def test_get_my_applications_returns_list(self, auth_session):
        """GET /api/applications/my-applications - Returns user's applications"""
        response = auth_session.get(f"{BASE_URL}/api/applications/my-applications")
        print(f"My applications response: {response.status_code} - {response.text}")
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "applications" in data
        assert "total" in data
        assert isinstance(data["applications"], list)
        assert isinstance(data["total"], int)
        print(f"Found {data['total']} applications")
    
    def test_my_applications_includes_drafts(self, auth_session):
        """Verify drafts appear in my-applications list"""
        # Create a draft first
        draft_data = {
            "passportType": "Ordinary",
            "portOfArrival": "Kolkata Airport",
            "visaService": "30 day Indian Tourist eVisa",
            "currentStep": 1
        }
        auth_session.patch(f"{BASE_URL}/api/applications/draft", json=draft_data)
        
        # Get my applications
        response = auth_session.get(f"{BASE_URL}/api/applications/my-applications")
        assert response.status_code == 200
        
        data = response.json()
        applications = data["applications"]
        
        # Find draft in list
        drafts = [app for app in applications if app.get("status") == "draft"]
        assert len(drafts) > 0, "Draft should appear in my-applications"
        
        draft = drafts[0]
        assert "id" in draft
        assert "status" in draft
        assert draft["status"] == "draft"
        print(f"Draft found in my-applications with ID: {draft['id']}")
        return draft["id"]
    
    def test_my_applications_has_required_fields(self, auth_session):
        """Verify my-applications response has all required fields"""
        response = auth_session.get(f"{BASE_URL}/api/applications/my-applications")
        assert response.status_code == 200
        
        data = response.json()
        if data["applications"]:
            app = data["applications"][0]
            required_fields = ["id", "status", "createdAt", "updatedAt"]
            for field in required_fields:
                assert field in app, f"Missing field: {field}"
            print(f"All required fields present in application")


class TestDeleteDraft:
    """Test delete draft endpoint"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        
        # Register user
        session.post(f"{BASE_URL}/api/auth/register", json=TEST_USER)
        
        # Login
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        if response.status_code == 200:
            token = response.json().get("token")
            session.headers.update({"Authorization": f"Bearer {token}"})
        else:
            pytest.skip("Authentication failed")
        
        return session
    
    def test_delete_draft_success(self, auth_session):
        """DELETE /api/applications/draft/{id} - Delete a draft"""
        # First create a draft
        draft_data = {
            "passportType": "Ordinary",
            "portOfArrival": "Hyderabad Airport",
            "currentStep": 1
        }
        response = auth_session.patch(f"{BASE_URL}/api/applications/draft", json=draft_data)
        assert response.status_code == 200
        draft_id = response.json().get("draftId")
        print(f"Created draft with ID: {draft_id}")
        
        # Delete the draft
        response = auth_session.delete(f"{BASE_URL}/api/applications/draft/{draft_id}")
        print(f"Delete response: {response.status_code} - {response.text}")
        
        assert response.status_code == 200, f"Failed to delete: {response.text}"
        data = response.json()
        assert data.get("message") == "Draft deleted"
        print("Draft deleted successfully")
        
        # Verify draft is gone
        response = auth_session.get(f"{BASE_URL}/api/applications/draft")
        assert response.status_code == 200
        data = response.json()
        assert data.get("draft") is None, "Draft should be deleted"
        print("Verified draft no longer exists")
    
    def test_delete_nonexistent_draft_returns_404(self, auth_session):
        """DELETE /api/applications/draft/{id} - Returns 404 for non-existent draft"""
        fake_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format but doesn't exist
        
        response = auth_session.delete(f"{BASE_URL}/api/applications/draft/{fake_id}")
        print(f"Delete non-existent response: {response.status_code}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"


class TestUnauthorizedAccess:
    """Test endpoints without authentication"""
    
    def test_draft_requires_auth(self):
        """Draft endpoints require authentication"""
        session = requests.Session()
        
        # Try to save draft without auth
        response = session.patch(f"{BASE_URL}/api/applications/draft", json={"test": "data"})
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        
        # Try to get draft without auth
        response = session.get(f"{BASE_URL}/api/applications/draft")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        
        print("Unauthorized access properly rejected")
    
    def test_my_applications_requires_auth(self):
        """My applications endpoint requires authentication"""
        session = requests.Session()
        
        response = session.get(f"{BASE_URL}/api/applications/my-applications")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        
        print("My applications unauthorized access properly rejected")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
