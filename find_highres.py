import urllib.request
import re

url = "https://streamable.com/em49in"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

urls = set(re.findall(r'https://[^"]+\.mp4[^"]*', html))
print("Found MP4 URLs:")
for u in urls:
    print(u.replace('&amp;', '&'))
