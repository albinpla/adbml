import requests
from base64 import urlsafe_b64encode
 
target_website = "https://www.geeksforgeeks.org/"
 
key = "z5DtMTWLGsqtatpZCBCb"
secret_key = "rBrCdyeO92kaV7eBzlRj"
 
api_url = "https://api.webshrinker.com/categories/v2/%s" % urlsafe_b64encode(target_website)
 
response = requests.get(api_url, auth=(key, secret_key))

status_code = response.status_code
data = response.json()
print(data)