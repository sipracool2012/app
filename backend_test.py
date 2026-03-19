#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Clear eVisa Visa Application API
Tests all the endpoints mentioned in the review request
"""
import requests
import json
import os
from datetime import datetime

# Configuration
BASE_URL = "http://127.0.0.1:3000/"
HEADERS = {"Content-Type": "application/json"}

class Clear eVisaVisaAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.user_data = None
        self.application_id = None
        
    def print_test_result(self, test_name, success, status_code=None, response_data=None, error_msg=None):
        """Print formatted test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"\n{status} {test_name}")
        if status_code:
            print(f"   Status Code: {status_code}")
        if response_data and success:
            print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
        if error_msg:
            print(f"   Error: {error_msg}")
    
    def test_user_registration(self):
        """Test 1: User Registration"""
        test_name = "User Registration"
        url = f"{self.base_url}/api/auth/register"
        
        # Use realistic test data
        payload = {
            "fullName": "Sarah Johnson",
            "email": f"sarah.johnson+{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "SecurePass123!"
        }
        
        try:
            response = requests.post(url, json=payload, headers=HEADERS, timeout=30)
            
            if response.status_code == 200:
                response_data = response.json()
                if "token" in response_data and "user" in response_data:
                    self.token = response_data["token"]
                    self.user_data = response_data["user"]
                    self.print_test_result(test_name, True, response.status_code, response_data)
                    return True
                else:
                    self.print_test_result(test_name, False, response.status_code, error_msg="Missing token or user in response")
                    return False
            else:
                self.print_test_result(test_name, False, response.status_code, error_msg=response.text)
                return False
                
        except Exception as e:
            self.print_test_result(test_name, False, error_msg=str(e))
            return False
    
    def test_user_login(self):
        """Test 2: User Login"""
        test_name = "User Login"
        url = f"{self.base_url}/api/auth/login"
        
        # Use the email from registration
        if not self.user_data:
            self.print_test_result(test_name, False, error_msg="No user data from registration")
            return False
            
        payload = {
            "email": self.user_data["email"],
            "password": "SecurePass123!"
        }
        
        try:
            response = requests.post(url, json=payload, headers=HEADERS, timeout=30)
            
            if response.status_code == 200:
                response_data = response.json()
                if "token" in response_data and "user" in response_data:
                    self.token = response_data["token"]  # Update token
                    self.print_test_result(test_name, True, response.status_code, response_data)
                    return True
                else:
                    self.print_test_result(test_name, False, response.status_code, error_msg="Missing token or user in response")
                    return False
            else:
                self.print_test_result(test_name, False, response.status_code, error_msg=response.text)
                return False
                
        except Exception as e:
            self.print_test_result(test_name, False, error_msg=str(e))
            return False
    
    def test_get_current_user(self):
        """Test 3: Get Current User"""
        test_name = "Get Current User"
        url = f"{self.base_url}/api/auth/me"
        
        if not self.token:
            self.print_test_result(test_name, False, error_msg="No auth token available")
            return False
            
        headers = {**HEADERS, "Authorization": f"Bearer {self.token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                response_data = response.json()
                if "id" in response_data and "email" in response_data:
                    self.print_test_result(test_name, True, response.status_code, response_data)
                    return True
                else:
                    self.print_test_result(test_name, False, response.status_code, error_msg="Missing user fields in response")
                    return False
            else:
                self.print_test_result(test_name, False, response.status_code, error_msg=response.text)
                return False
                
        except Exception as e:
            self.print_test_result(test_name, False, error_msg=str(e))
            return False
    
    def test_create_visa_application(self):
        """Test 4: Create Visa Application"""
        test_name = "Create Visa Application"
        url = f"{self.base_url}/api/applications"
        
        if not self.token:
            self.print_test_result(test_name, False, error_msg="No auth token available")
            return False
            
        headers = {**HEADERS, "Authorization": f"Bearer {self.token}"}
        
        # Use realistic visa application data
        payload = {
            # Step 1: Basic Info
            "passportType": "Ordinary",
            "nationality": "United States",
            "portOfArrival": "Delhi",
            "dateOfBirth": "1985-03-15",
            "email": self.user_data["email"] if self.user_data else "sarah.johnson@example.com",
            "confirmEmail": self.user_data["email"] if self.user_data else "sarah.johnson@example.com",
            "expectedArrivalDate": "2024-06-15",
            "visaService": "Tourist Visa",
            "visaServiceSubtype": "30 Days Single Entry",
            
            # Step 2: Applicant Details
            "surname": "Johnson",
            "givenNames": "Sarah Marie",
            "gender": "Female",
            "applicantDateOfBirth": "1985-03-15",
            "townOfBirth": "New York",
            "countryOfBirth": "United States",
            "citizenshipNo": "US123456789",
            "religion": "Christianity",
            "visibleMarks": "None",
            "educationalQualification": "Master's Degree",
            "qualificationFrom": "Columbia University",
            "applicantNationality": "United States",
            "nationalityByBirth": "United States",
            "livedTwoYears": "Yes",
            
            # Step 3: Passport Details
            "passportNumber": "US123456789",
            "placeOfIssue": "New York",
            "dateOfIssue": "2020-01-15",
            "dateOfExpiry": "2030-01-15",
            "otherPassportHeld": "No",
            
            # Step 4: Address Details
            "houseNoStreet": "123 Main Street",
            "villageTownCity": "New York",
            "country": "United States",
            "stateProvince": "New York",
            "postalCode": "10001",
            "phoneNo": "+1-555-123-4567",
            "mobileNo": "+1-555-987-6543",
            "emailAddress": self.user_data["email"] if self.user_data else "sarah.johnson@example.com",
            
            # Step 5: Family Details
            "fatherName": "Robert Johnson",
            "fatherNationality": "United States",
            "fatherPreviousNationality": "",
            "fatherPlaceOfBirth": "Chicago",
            "fatherCountryOfBirth": "United States",
            "motherName": "Mary Johnson",
            "motherNationality": "United States",
            "motherPreviousNationality": "",
            "motherPlaceOfBirth": "Boston",
            "motherCountryOfBirth": "United States",
            "maritalStatus": "Married",
            "spouseName": "Michael Johnson",
            "spouseNationality": "United States",
            "spousePreviousNationality": "",
            "spousePlaceOfBirth": "Los Angeles",
            "spouseCountryOfBirth": "United States",
            "pakistanConnection": "No",
            
            # Step 6: Professional Details
            "presentOccupation": "Software Engineer",
            "employerName": "Tech Solutions Inc",
            "designation": "Senior Developer",
            "employerAddress": "456 Tech Street, San Francisco, CA",
            "employerPhone": "+1-555-234-5678",
            "pastOccupation": "Junior Developer",
            "militaryService": "No",
            "pastOccupationIfAny": "Student",
            
            # Step 7: Visa Details
            "typeOfVisa": "Tourist",
            "visaServiceType": "Tourist Visa",
            "placesToVisit": "Delhi, Mumbai, Agra",
            "placesToVisitLine2": "Jaipur, Goa",
            "hotelBooked": "Yes",
            "durationOfVisa": "30 Days",
            "numberOfEntries": "Single",
            "portOfArrivalIndia": "Delhi",
            "expectedPortOfExit": "Mumbai",
            
            # Step 8: Previous Visit
            "visitedIndiaBefore": "No",
            
            # Step 9: Other Info
            "countriesVisited": "Canada, Mexico, United Kingdom",
            "visitedSAARCCountries": "No",
            
            # Step 10: References
            "indiaReferenceName": "Rajesh Sharma",
            "indiaReferenceAddress": "789 Delhi Street, New Delhi, India",
            "indiaReferencePhone": "+91-9876543210",
            "homeReferenceName": "Jennifer Smith",
            "homeReferenceAddress": "321 Oak Street, New York, NY",
            "homeReferencePhone": "+1-555-345-6789",
            
            # Step 11: Additional Questions
            "arrestedConvicted": "No",
            "refusedEntry": "No",
            "humanTrafficking": "No",
            "cyberCrime": "No",
            "terroristViews": "No",
            "asylumSought": "No",
            
            # Step 12: Documents
            "passportDocument": "",
            "photoDocument": "",
            
            # Payment
            "paymentStatus": "completed"
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                response_data = response.json()
                if "id" in response_data and "status" in response_data:
                    self.application_id = response_data["id"]
                    self.print_test_result(test_name, True, response.status_code, response_data)
                    return True
                else:
                    self.print_test_result(test_name, False, response.status_code, error_msg="Missing id or status in response")
                    return False
            else:
                self.print_test_result(test_name, False, response.status_code, error_msg=response.text)
                return False
                
        except Exception as e:
            self.print_test_result(test_name, False, error_msg=str(e))
            return False
    
    def test_get_all_applications(self):
        """Test 5: Get All Applications"""
        test_name = "Get All Applications"
        url = f"{self.base_url}/api/applications"
        
        if not self.token:
            self.print_test_result(test_name, False, error_msg="No auth token available")
            return False
            
        headers = {**HEADERS, "Authorization": f"Bearer {self.token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                response_data = response.json()
                if "applications" in response_data and "total" in response_data:
                    self.print_test_result(test_name, True, response.status_code, response_data)
                    return True
                else:
                    self.print_test_result(test_name, False, response.status_code, error_msg="Missing applications or total in response")
                    return False
            else:
                self.print_test_result(test_name, False, response.status_code, error_msg=response.text)
                return False
                
        except Exception as e:
            self.print_test_result(test_name, False, error_msg=str(e))
            return False
    
    def test_update_application_status(self):
        """Test 6: Update Application Status"""
        test_name = "Update Application Status"
        
        if not self.application_id:
            self.print_test_result(test_name, False, error_msg="No application ID available")
            return False
            
        url = f"{self.base_url}/api/applications/{self.application_id}/status"
        
        if not self.token:
            self.print_test_result(test_name, False, error_msg="No auth token available")
            return False
            
        headers = {**HEADERS, "Authorization": f"Bearer {self.token}"}
        payload = {"status": "approved"}
        
        try:
            response = requests.patch(url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                response_data = response.json()
                if "id" in response_data and "status" in response_data and response_data["status"] == "approved":
                    self.print_test_result(test_name, True, response.status_code, response_data)
                    return True
                else:
                    self.print_test_result(test_name, False, response.status_code, error_msg="Status not updated correctly")
                    return False
            else:
                self.print_test_result(test_name, False, response.status_code, error_msg=response.text)
                return False
                
        except Exception as e:
            self.print_test_result(test_name, False, error_msg=str(e))
            return False
    
    def test_export_applications_csv(self):
        """Test 7: Export Applications CSV"""
        test_name = "Export Applications CSV"
        url = f"{self.base_url}/api/applications/export"
        
        if not self.token:
            self.print_test_result(test_name, False, error_msg="No auth token available")
            return False
            
        headers = {**HEADERS, "Authorization": f"Bearer {self.token}"}
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                # Check if response is CSV
                content_type = response.headers.get('content-type', '')
                if 'text/csv' in content_type or 'application/csv' in content_type:
                    # Check if CSV content is not empty
                    csv_content = response.text
                    if len(csv_content) > 0 and 'Application ID' in csv_content:
                        self.print_test_result(test_name, True, response.status_code, {"csv_length": len(csv_content), "has_header": True})
                        return True
                    else:
                        self.print_test_result(test_name, False, response.status_code, error_msg="CSV content is empty or missing headers")
                        return False
                else:
                    self.print_test_result(test_name, False, response.status_code, error_msg=f"Expected CSV but got content-type: {content_type}")
                    return False
            else:
                self.print_test_result(test_name, False, response.status_code, error_msg=response.text)
                return False
                
        except Exception as e:
            self.print_test_result(test_name, False, error_msg=str(e))
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("="*60)
        print("Clear eVisa VISA APPLICATION API TESTING")
        print(f"Base URL: {self.base_url}")
        print("="*60)
        
        test_results = []
        
        # Test 1: User Registration
        test_results.append(self.test_user_registration())
        
        # Test 2: User Login
        test_results.append(self.test_user_login())
        
        # Test 3: Get Current User
        test_results.append(self.test_get_current_user())
        
        # Test 4: Create Visa Application
        test_results.append(self.test_create_visa_application())
        
        # Test 5: Get All Applications
        test_results.append(self.test_get_all_applications())
        
        # Test 6: Update Application Status
        test_results.append(self.test_update_application_status())
        
        # Test 7: Export Applications CSV
        test_results.append(self.test_export_applications_csv())
        
        # Summary
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        passed = sum(test_results)
        total = len(test_results)
        print(f"Tests Passed: {passed}/{total}")
        print(f"Success Rate: {passed/total*100:.1f}%")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED!")
        else:
            print("⚠️  Some tests failed. Check the detailed output above.")
        
        return passed == total

if __name__ == "__main__":
    tester = Clear eVisaVisaAPITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)