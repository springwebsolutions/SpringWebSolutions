import base64
import os

img_path = r'c:\Users\shanj\OneDrive\Desktop\SpringWeb Solutions\public\logo-emblem.png'
svg_path = r'c:\Users\shanj\OneDrive\Desktop\SpringWeb Solutions\public\favicon.svg'

with open(img_path, 'rb') as f:
    png_data = f.read()

b64_str = base64.b64encode(png_data).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <image href="data:image/png;base64,{b64_str}" width="500" height="500" />
</svg>'''

with open(svg_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print('Successfully generated pixel-perfect favicon.svg matching logo-emblem.png')
