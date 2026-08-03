import os
from PIL import Image

def build_extension_icons():
    src_logo = os.path.abspath('public/logo-emblem.jpg')
    icons_dir = os.path.abspath('chrome-extension/icons')
    os.makedirs(icons_dir, exist_ok=True)

    img = Image.open(src_logo).convert('RGBA')

    # Convert near-white background to transparent
    r, g, b, _ = img.split()
    mask_r = r.point(lambda p: 0 if p > 230 else 255)
    transparent_img = img.copy()
    transparent_img.putalpha(mask_r)

    sizes = [
        ('icon16.png', 16, 16),
        ('icon48.png', 48, 48),
        ('icon128.png', 128, 128)
    ]

    for fname, w, h in sizes:
        resized = transparent_img.resize((w, h), Image.Resampling.LANCZOS)
        resized.save(os.path.join(icons_dir, fname), format='PNG')
        print(f"Generated extension icon {fname} ({w}x{h})")

if __name__ == '__main__':
    build_extension_icons()
