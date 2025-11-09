
import requests
import os

# The image file to upload
image_path = os.path.join('UI_Integrate', 'public', 'images', 'design-mode', 'image.png')

# The URL of the Next.js API endpoint
url = 'http://localhost:3002/api/analyze'

try:
    with open(image_path, 'rb') as f:
        files = {'file': ('image.png', f, 'image/png')}
        
        print(f"Sending POST request to {url} with image {image_path}...")
        
        # Send the request
        response = requests.post(url, files=files)
        
        # Print the response from the server
        print(f"Status Code: {response.status_code}")
        print("Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        print("Response Body:")
        # Try to print JSON if possible, otherwise print text
        try:
            print(response.json())
        except requests.exceptions.JSONDecodeError:
            print(response.text)

except FileNotFoundError:
    print(f"Error: The file was not found at {image_path}")
except requests.exceptions.RequestException as e:
    print(f"An error occurred during the request: {e}")

