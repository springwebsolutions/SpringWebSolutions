import os
import base64
from PIL import Image

def process_original_logo():
    jpg_path = os.path.abspath('public/logo-emblem.jpg')
    if not os.path.exists(jpg_path):
        print("ERROR: logo-emblem.jpg not found!")
        return

    # Open original logo image
    img = Image.open(jpg_path).convert('RGBA')

    # Create mask: near-white background (r>230, g>230, b>230) becomes transparent
    r, g, b, _ = img.split()
    mask_r = r.point(lambda p: 0 if p > 230 else 255)
    mask_g = g.point(lambda p: 0 if p > 230 else 255)
    mask_b = b.point(lambda p: 0 if p > 230 else 255)

    # Combine RGB masks
    alpha_mask = Image.eval(mask_r, lambda p: p)

    transparent_img = img.copy()
    transparent_img.putalpha(alpha_mask)

    output_dir = os.path.abspath('public')

    sizes = [
        ('favicon-48x48.png', 48, 48),
        ('favicon-96x96.png', 96, 96),
        ('apple-touch-icon.png', 180, 180),
        ('favicon-192x192.png', 192, 192),
        ('favicon-512x512.png', 512, 512),
        ('favicon.png', 512, 512),
        ('logo-emblem.png', 500, 500),
        ('logo.png', 500, 500),
    ]

    for filename, w, h in sizes:
        resized = transparent_img.resize((w, h), Image.Resampling.LANCZOS)
        out_path = os.path.join(output_dir, filename)
        resized.save(out_path, format='PNG')
        print(f"Saved original logo PNG: {filename} ({w}x{h})")

    # Multi-resolution favicon.ico
    img_48 = transparent_img.resize((48, 48), Image.Resampling.LANCZOS)
    ico_path = os.path.join(output_dir, 'favicon.ico')
    img_48.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print("Saved original logo favicon.ico")

    # SVG embedding exact original logo
    png_512_path = os.path.join(output_dir, 'favicon-512x512.png')
    with open(png_512_path, 'rb') as f:
        b64_png = base64.b64encode(f.read()).decode('utf-8')

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="100%" height="100%">
  <image width="512" height="512" xlink:href="data:image/png;base64,{b64_png}" />
</svg>'''

    svg_path = os.path.join(output_dir, 'favicon.svg')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Saved original logo favicon.svg")

if __name__ == '__main__':
    process_original_logo()
