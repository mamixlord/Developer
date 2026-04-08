#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class BilayDemirAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session = requests.Session()

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:500]}")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:500]
                })

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success

    def test_services_api(self):
        """Test services API"""
        success, response = self.run_test(
            "Get Services",
            "GET", 
            "api/services",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} services")
        return success

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": "admin@bilaydemir.com", "password": "BilayAdmin2024!"}
        )
        if success and 'id' in response:
            print(f"   Logged in as: {response.get('email')} (Role: {response.get('role')})")
            # Store cookies for subsequent requests
            return True
        return False

    def test_auth_me(self):
        """Test auth/me endpoint"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "api/auth/me", 
            200
        )
        if success:
            print(f"   User: {response.get('email')} (Role: {response.get('role')})")
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "api/contact",
            200,
            data={
                "name": "Test User",
                "email": "test@example.com", 
                "phone": "+90 555 123 4567",
                "message": "Test message from API test"
            }
        )
        return success

    def test_offer_request(self):
        """Test offer request submission"""
        # Note: This endpoint expects form data, not JSON
        url = f"{self.base_url}/api/offer-request"
        print(f"\n🔍 Testing Offer Request Submission...")
        print(f"   URL: {url}")
        
        try:
            form_data = {
                'name': 'Test Customer',
                'phone': '+90 555 987 6543',
                'service': 'Demir Kapi',
                'width': '200cm',
                'height': '250cm',
                'message': 'Test offer request from API test'
            }
            
            response = self.session.post(url, data=form_data)
            self.tests_run += 1
            
            if response.status_code == 200:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"   Response: {response.text[:200]}...")
                return True
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                print(f"   Response: {response.text[:500]}")
                self.failed_tests.append({
                    "test": "Offer Request Submission",
                    "endpoint": "api/offer-request",
                    "expected": 200,
                    "actual": response.status_code,
                    "response": response.text[:500]
                })
                return False
                
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": "Offer Request Submission",
                "endpoint": "api/offer-request", 
                "error": str(e)
            })
            return False

    def test_public_endpoints(self):
        """Test other public endpoints"""
        endpoints = [
            ("Get Projects", "api/projects", 200),
            ("Get Blog Posts", "api/blog", 200),
            ("Get Testimonials", "api/testimonials", 200),
            ("Get Site Settings", "api/site-settings", 200)
        ]
        
        results = []
        for name, endpoint, expected_status in endpoints:
            success, _ = self.run_test(name, "GET", endpoint, expected_status)
            results.append(success)
        
        return all(results)

def main():
    print("🚀 Starting Bilay Demir Dograma API Tests")
    print("=" * 50)
    
    tester = BilayDemirAPITester()
    
    # Test sequence
    tests = [
        ("Health Check", tester.test_health_check),
        ("Services API", tester.test_services_api),
        ("Admin Login", tester.test_admin_login),
        ("Auth Me", tester.test_auth_me),
        ("Contact Form", tester.test_contact_form),
        ("Offer Request", tester.test_offer_request),
        ("Public Endpoints", tester.test_public_endpoints)
    ]
    
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            tester.failed_tests.append({
                "test": test_name,
                "error": str(e)
            })
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            error_msg = failure.get('error', f"Status {failure.get('actual')} != {failure.get('expected')}")
            print(f"   - {failure['test']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n🎯 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())