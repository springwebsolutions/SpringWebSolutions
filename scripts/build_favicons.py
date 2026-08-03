import os
import subprocess
import time
from PIL import Image

def generate_favicons():
    svg_path = os.path.abspath('public/favicon.svg')
    output_dir = os.path.abspath('public')
    
    # HTML wrapper for rendering SVG precisely
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <style>
    body, html {{ margin: 0; padding: 0; background: transparent; overflow: hidden; width: 100%; height: 100%; }}
    svg {{ width: 100%; height: 100%; display: block; }}
  </style>
</head>
<body>
  {open(svg_path, 'r', encoding='utf-8').read()}
</body>
</html>"""
    
    temp_html = os.path.join(output_dir, 'temp_icon.html')
    with open(temp_html, 'w', encoding='utf-8') as f:
        f.write(html_content)

    # Edge or Chrome headless executable paths on Windows
    msedge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    
    browser_exe = msedge_path if os.path.exists(msedge_path) else chrome_path

    sizes = [
        ('favicon-48x48.png', 48, 48),
        ('favicon-96x96.png', 96, 96),
        ('apple-touch-icon.png', 180, 180),
        ('favicon-192x192.png', 192, 192),
        ('favicon-512x512.png', 512, 512),
        ('favicon.png', 512, 512),
        ('logo-emblem.png', 512, 512),
    ]

    for filename, width, height in sizes:
        dest_path = os.path.join(output_dir, filename)
        cmd = [
            browser_exe,
            '--headless',
            '--disable-gpu',
            '--force-device-scale-factor=1',
            f'--window-size={width},{height}',
            f'--screenshot={dest_path}',
            f'file:///{temp_html.replace("\\", "/")}'
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"Generated {filename} ({width}x{height})")

    # Clean up temp HTML
    if os.path.exists(temp_html):
        os.remove(temp_html)

    # Build multi-resolution favicon.ico containing 16x16, 32x32, 48x48
    img_48 = Image.open(os.path.join(output_dir, 'favicon-48x48.png'))
    ico_path = os.path.join(output_dir, 'favicon.ico')
    img_48.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print("Generated multi-resolution favicon.ico")

if __name__ == '__main__':
    generate_favicons()
