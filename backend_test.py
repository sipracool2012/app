#!/usr/bin/env python3
"""
Backend API Testing for Clear eVisa Country Visa Configuration System
Tests all country visa configuration endpoints with comprehensive scenarios
"""

import requests
import json
from datetime import datetime, timedelta
import sys
import os

# Get backend URL from environment
BACKEND_URL = "http://127.0.0.1:8001"

class APITestRunner:
    def __init__(self, base_url):
        self.base_url = base_url
        self.passed_tests = 0
        self.failed_tests = 0
        self.test_results = []

    def log_test(self, test_name, passed, message="", response_data=None):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"    {message}")
        if not passed and response_data:
            print(f"    Response: {response_data}")
        print()
        
        self.test_results.append({
            'test': test_name,
            'passed': passed,
            'message': message
        })
        
        if passed:
            self.passed_tests += 1
        else:
            self.failed_tests += 1

    def test_seed_countries(self):
        """Test POST /api/countries/seed - Seed sample countries"""
        try:
            response = requests.post(f"{self.base_url}/api/countries/seed", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                # Check if seeding was successful or already done
                if data.get('status') in ['success', 'already_seeded']:
                    self.log_test(
                        "POST /api/countries/seed", 
                        True, 
                        f"Seed status: {data.get('status')}, Records: {data.get('seeded', data.get('count'))}"
                    )
                    return True
                else:
                    self.log_test("POST /api/countries/seed", False, f"Unexpected status: {data}")
            else:
                self.log_test("POST /api/countries/seed", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("POST /api/countries/seed", False, f"Exception: {str(e)}")
        
        return False

    def test_get_all_countries(self):
        """Test GET /api/countries/all - Get all countries"""
        try:
            response = requests.get(f"{self.base_url}/api/countries/all", timeout=10)
            
            if response.status_code == 200:
                countries = response.json()
                
                if isinstance(countries, list) and len(countries) >= 195:
                    # Check that it contains expected structure
                    sample_country = countries[0]
                    required_fields = ['country_code', 'country_name', 'country_enabled']
                    
                    if all(field in sample_country for field in required_fields):
                        enabled_count = len([c for c in countries if c.get('country_enabled', False)])
                        self.log_test(
                            "GET /api/countries/all", 
                            True, 
                            f"Total countries: {len(countries)}, Enabled: {enabled_count}"
                        )
                        return countries
                    else:
                        self.log_test("GET /api/countries/all", False, f"Missing required fields: {required_fields}")
                else:
                    self.log_test("GET /api/countries/all", False, f"Expected 195+ countries, got {len(countries) if isinstance(countries, list) else 'non-list'}")
            else:
                self.log_test("GET /api/countries/all", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("GET /api/countries/all", False, f"Exception: {str(e)}")
        
        return None

    def test_get_enabled_countries(self):
        """Test GET /api/countries/enabled - Get only enabled countries"""
        try:
            response = requests.get(f"{self.base_url}/api/countries/enabled", timeout=10)
            
            if response.status_code == 200:
                enabled_countries = response.json()
                
                if isinstance(enabled_countries, list):
                    # Verify structure
                    if len(enabled_countries) > 0:
                        sample = enabled_countries[0]
                        required_fields = ['code', 'name', 'flag']
                        
                        if all(field in sample for field in required_fields):
                            # Verify ordering (should be sorted by name)
                            names = [c['name'] for c in enabled_countries]
                            is_sorted = names == sorted(names)
                            
                            self.log_test(
                                "GET /api/countries/enabled", 
                                True, 
                                f"Enabled countries: {len(enabled_countries)}, Sorted: {is_sorted}"
                            )
                            return enabled_countries
                        else:
                            self.log_test("GET /api/countries/enabled", False, f"Missing required fields: {required_fields}")
                    else:
                        self.log_test("GET /api/countries/enabled", True, "No enabled countries found (valid scenario)")
                        return enabled_countries
                else:
                    self.log_test("GET /api/countries/enabled", False, f"Expected list, got {type(enabled_countries)}")
            else:
                self.log_test("GET /api/countries/enabled", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("GET /api/countries/enabled", False, f"Exception: {str(e)}")
        
        return None

    def test_visa_options_us(self):
        """Test GET /api/countries/US/visa-options - Test US visa options"""
        try:
            response = requests.get(f"{self.base_url}/api/countries/US/visa-options", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check structure
                required_fields = ['has_evisa_options', 'country_name', 'options']
                if all(field in data for field in required_fields):
                    
                    if data['has_evisa_options'] and len(data['options']) > 0:
                        # Verify visa options structure and calculations
                        options = data['options']
                        tourist_options = [opt for opt in options if opt['visa_type'] == 'tourist']
                        business_options = [opt for opt in options if opt['visa_type'] == 'business']
                        medical_options = [opt for opt in options if opt['visa_type'] == 'medical']
                        
                        # Test expected tourist options (30d, 1yr, 5yr)
                        tourist_durations = [opt['duration'] for opt in tourist_options]
                        expected_durations = {'30d', '1yr', '5yr'}
                        has_expected_tourist = expected_durations.issubset(set(tourist_durations))
                        
                        # Verify price calculation (should be govt_fee + payment_fee + processing_fee)
                        price_correct = True
                        for opt in options:
                            calculated_price = opt['govt_fee'] + opt['payment_fee'] + opt['processing_fee']
                            if abs(opt['price'] - calculated_price) > 0.01:  # Allow for rounding
                                price_correct = False
                                break
                        
                        # Check approval date (should be today + 5 days)
                        approval_date_correct = True
                        expected_date = (datetime.utcnow() + timedelta(days=5)).strftime('%B %d')
                        for opt in options:
                            if opt.get('approved_by') != expected_date:
                                approval_date_correct = False
                                break
                        
                        success = has_expected_tourist and price_correct and approval_date_correct
                        message = f"Tourist options: {len(tourist_options)}, Business: {len(business_options)}, Medical: {len(medical_options)}, Price calc: {price_correct}, Date calc: {approval_date_correct}"
                        
                        self.log_test("GET /api/countries/US/visa-options", success, message)
                        return data
                    else:
                        self.log_test("GET /api/countries/US/visa-options", False, "No eVisa options found for US")
                else:
                    self.log_test("GET /api/countries/US/visa-options", False, f"Missing required fields: {required_fields}")
            else:
                self.log_test("GET /api/countries/US/visa-options", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("GET /api/countries/US/visa-options", False, f"Exception: {str(e)}")
        
        return None

    def test_visa_options_be(self):
        """Test GET /api/countries/BE/visa-options - Test Belgium visa options"""
        try:
            response = requests.get(f"{self.base_url}/api/countries/BE/visa-options", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('has_evisa_options') and len(data.get('options', [])) > 0:
                    options = data['options']
                    
                    # Belgium should only have tourist options (30d, 1yr) according to seed data
                    tourist_only = all(opt['visa_type'] == 'tourist' for opt in options)
                    tourist_durations = [opt['duration'] for opt in options]
                    expected_durations = {'30d', '1yr'}  # No 5yr for Belgium
                    has_correct_durations = set(tourist_durations) == expected_durations
                    
                    # No business, medical, or transit options
                    no_other_types = not any(opt['visa_type'] in ['business', 'medical', 'transit'] for opt in options)
                    
                    success = tourist_only and has_correct_durations and no_other_types
                    message = f"Options: {len(options)} (tourist only), Durations: {tourist_durations}, Other types: {not no_other_types}"
                    
                    self.log_test("GET /api/countries/BE/visa-options", success, message)
                    return data
                else:
                    self.log_test("GET /api/countries/BE/visa-options", False, "No eVisa options found for Belgium")
            else:
                self.log_test("GET /api/countries/BE/visa-options", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("GET /api/countries/BE/visa-options", False, f"Exception: {str(e)}")
        
        return None

    def test_visa_options_disabled_country(self):
        """Test visa options for a disabled/non-configured country"""
        try:
            # Test with a country that should not be enabled (using ZW - Zimbabwe)
            response = requests.get(f"{self.base_url}/api/countries/ZW/visa-options", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Should return no eVisa options
                if not data.get('has_evisa_options', True) and len(data.get('options', [])) == 0:
                    expected_message = 'No eVisa options available. Please apply through embassy or consulate.'
                    has_correct_message = data.get('message') == expected_message
                    
                    self.log_test(
                        "GET /api/countries/ZW/visa-options (disabled)", 
                        has_correct_message, 
                        f"No eVisa options: {not data.get('has_evisa_options', True)}, Message: {has_correct_message}"
                    )
                    return True
                else:
                    self.log_test("GET /api/countries/ZW/visa-options (disabled)", False, "Expected no eVisa options for disabled country")
            else:
                self.log_test("GET /api/countries/ZW/visa-options (disabled)", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("GET /api/countries/ZW/visa-options (disabled)", False, f"Exception: {str(e)}")
        
        return False

    def test_purposes_us(self):
        """Test GET /api/countries/US/purposes - Test US purposes"""
        try:
            response = requests.get(f"{self.base_url}/api/countries/US/purposes", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'purposes' in data:
                    purposes = data['purposes']
                    
                    if isinstance(purposes, list) and len(purposes) > 0:
                        # US should have tourist, business, and medical (based on seed data)
                        purpose_values = [p['value'] for p in purposes]
                        expected_purposes = {'tourist', 'business', 'medical'}
                        has_expected = expected_purposes.issubset(set(purpose_values))
                        
                        # Check structure
                        valid_structure = all('value' in p and 'label' in p for p in purposes)
                        
                        success = has_expected and valid_structure
                        self.log_test(
                            "GET /api/countries/US/purposes", 
                            success, 
                            f"Purposes: {purpose_values}, Structure valid: {valid_structure}"
                        )
                        return data
                    else:
                        self.log_test("GET /api/countries/US/purposes", False, f"Expected non-empty list, got: {purposes}")
                else:
                    self.log_test("GET /api/countries/US/purposes", False, "Missing 'purposes' field in response")
            else:
                self.log_test("GET /api/countries/US/purposes", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("GET /api/countries/US/purposes", False, f"Exception: {str(e)}")
        
        return None

    def test_purposes_be(self):
        """Test GET /api/countries/BE/purposes - Test Belgium purposes"""
        try:
            response = requests.get(f"{self.base_url}/api/countries/BE/purposes", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'purposes' in data:
                    purposes = data['purposes']
                    
                    if isinstance(purposes, list):
                        # Belgium should only have tourist (based on seed data)
                        purpose_values = [p['value'] for p in purposes]
                        expected_purposes = ['tourist']  # Only tourist for Belgium
                        has_only_tourist = set(purpose_values) == set(expected_purposes)
                        
                        success = has_only_tourist
                        self.log_test(
                            "GET /api/countries/BE/purposes", 
                            success, 
                            f"Purposes: {purpose_values} (expected: tourist only)"
                        )
                        return data
                    else:
                        self.log_test("GET /api/countries/BE/purposes", False, f"Expected list, got: {type(purposes)}")
                else:
                    self.log_test("GET /api/countries/BE/purposes", False, "Missing 'purposes' field in response")
            else:
                self.log_test("GET /api/countries/BE/purposes", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("GET /api/countries/BE/purposes", False, f"Exception: {str(e)}")
        
        return None

    def test_update_country_config(self):
        """Test PUT /api/countries/{country_code} - Update country configuration"""
        try:
            # Test updating Canada (CA) configuration
            update_data = {
                "tourist_30d_govt_fee": 30.00,
                "payment_fee": 3.00,
                "processing_fee": 50.00
            }
            
            response = requests.put(
                f"{self.base_url}/api/countries/CA", 
                json=update_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('status') == 'success':
                    # Verify the update by fetching visa options
                    verify_response = requests.get(f"{self.base_url}/api/countries/CA/visa-options", timeout=10)
                    
                    if verify_response.status_code == 200:
                        visa_data = verify_response.json()
                        
                        if visa_data.get('has_evisa_options') and len(visa_data.get('options', [])) > 0:
                            # Find 30-day tourist option and check if fees were updated
                            tourist_30d = next((opt for opt in visa_data['options'] if opt.get('duration') == '30d' and opt.get('visa_type') == 'tourist'), None)
                            
                            if tourist_30d:
                                fees_correct = (
                                    tourist_30d['govt_fee'] == 30.00 and
                                    tourist_30d['payment_fee'] == 3.00 and
                                    tourist_30d['processing_fee'] == 50.00 and
                                    tourist_30d['price'] == 83.00  # 30 + 3 + 50
                                )
                                
                                self.log_test(
                                    "PUT /api/countries/CA (update config)", 
                                    fees_correct, 
                                    f"Fees updated correctly: {fees_correct}, Price: {tourist_30d['price']}"
                                )
                                return fees_correct
                            else:
                                self.log_test("PUT /api/countries/CA (update config)", False, "Could not find 30d tourist option to verify")
                        else:
                            self.log_test("PUT /api/countries/CA (update config)", False, "No visa options available after update")
                    else:
                        self.log_test("PUT /api/countries/CA (update config)", False, f"Failed to verify update: HTTP {verify_response.status_code}")
                else:
                    self.log_test("PUT /api/countries/CA (update config)", False, f"Update failed: {data}")
            else:
                self.log_test("PUT /api/countries/CA (update config)", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("PUT /api/countries/CA (update config)", False, f"Exception: {str(e)}")
        
        return False

    def test_new_country_config(self):
        """Test creating configuration for a new country"""
        try:
            # Test creating config for Australia (AU) - should not be in seed data
            update_data = {
                "country_enabled": True,
                "tourist_enabled": True,
                "tourist_30d_enabled": True,
                "tourist_30d_govt_fee": 20.00,
                "payment_fee": 2.50,
                "processing_fee": 40.00
            }
            
            response = requests.put(
                f"{self.base_url}/api/countries/AU", 
                json=update_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('status') == 'success':
                    # Verify Australia now appears in enabled countries
                    enabled_response = requests.get(f"{self.base_url}/api/countries/enabled", timeout=10)
                    
                    if enabled_response.status_code == 200:
                        enabled_countries = enabled_response.json()
                        au_enabled = any(c['code'] == 'AU' for c in enabled_countries)
                        
                        if au_enabled:
                            # Check visa options
                            visa_response = requests.get(f"{self.base_url}/api/countries/AU/visa-options", timeout=10)
                            
                            if visa_response.status_code == 200:
                                visa_data = visa_response.json()
                                has_options = visa_data.get('has_evisa_options') and len(visa_data.get('options', [])) > 0
                                
                                self.log_test(
                                    "PUT /api/countries/AU (new country)", 
                                    has_options, 
                                    f"Created new country config, Has options: {has_options}"
                                )
                                return has_options
                            else:
                                self.log_test("PUT /api/countries/AU (new country)", False, f"Failed to get visa options: HTTP {visa_response.status_code}")
                        else:
                            self.log_test("PUT /api/countries/AU (new country)", False, "Australia not found in enabled countries")
                    else:
                        self.log_test("PUT /api/countries/AU (new country)", False, f"Failed to get enabled countries: HTTP {enabled_response.status_code}")
                else:
                    self.log_test("PUT /api/countries/AU (new country)", False, f"Creation failed: {data}")
            else:
                self.log_test("PUT /api/countries/AU (new country)", False, f"HTTP {response.status_code}", response.text)
            
        except Exception as e:
            self.log_test("PUT /api/countries/AU (new country)", False, f"Exception: {str(e)}")
        
        return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 60)
        print("COUNTRY VISA CONFIGURATION API TESTS")
        print("=" * 60)
        print()
        
        # Test seeding first (required for other tests)
        print("1. Testing Country Seeding...")
        self.test_seed_countries()
        
        print("2. Testing Get All Countries...")
        self.test_get_all_countries()
        
        print("3. Testing Get Enabled Countries...")
        self.test_get_enabled_countries()
        
        print("4. Testing Visa Options...")
        self.test_visa_options_us()
        self.test_visa_options_be()
        self.test_visa_options_disabled_country()
        
        print("5. Testing Country Purposes...")
        self.test_purposes_us()
        self.test_purposes_be()
        
        print("6. Testing Country Configuration Updates...")
        self.test_update_country_config()
        self.test_new_country_config()
        
        # Print summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"Total: {self.passed_tests + self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests / (self.passed_tests + self.failed_tests) * 100):.1f}%")
        print()
        
        if self.failed_tests > 0:
            print("FAILED TESTS:")
            for result in self.test_results:
                if not result['passed']:
                    print(f"  ❌ {result['test']}: {result['message']}")
            print()
        
        return self.failed_tests == 0


if __name__ == "__main__":
    print("Starting Country Visa Configuration API Tests...")
    print(f"Backend URL: {BACKEND_URL}")
    print()
    
    tester = APITestRunner(BACKEND_URL)
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)