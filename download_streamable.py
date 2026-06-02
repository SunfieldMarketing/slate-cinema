import urllib.request
import re

url = "https://streamable.com/em49in"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# Find the meta tag with the video URL
match = re.search(r'<meta property="og:video:url" content="(https://[^"]+)"', html)
if match:
    video_url = match.group(1)
    video_url = video_url.replace("&amp;", "&")
    print(f"Found video URL: {video_url}")
    print("Downloading...")
    urllib.request.urlretrieve(video_url, "d:/Downloads/Slate Cinema 3D Interactive Scroll Driven Website/slate-cinema/public/videos/hero-camera.mp4")
    print("Downloaded successfully to public/videos/hero-camera.mp4")
else:
    print("Could not find video URL in the page.")
