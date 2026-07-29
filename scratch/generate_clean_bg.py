import math
from PIL import Image, ImageDraw, ImageFilter

def create_hero_bg():
    width = 1920
    height = 1080
    
    # Create base dark gradient image
    img = Image.new("RGBA", (width, height), (4, 5, 9, 255))
    draw = ImageDraw.Draw(img)
    
    # Add subtle dark radial glow layers
    for r in range(500, 0, -10):
        alpha = int((1 - r / 500) * 40)
        draw.ellipse([width/2 - r, height/2 - r, width/2 + r, height/2 + r], fill=(16, 185, 129, alpha))
        
    for r in range(400, 0, -10):
        alpha = int((1 - r / 400) * 35)
        draw.ellipse([width*0.8 - r, height*0.3 - r, width*0.8 + r, height*0.3 + r], fill=(99, 102, 241, alpha))

    # Draw high-tech grid lines
    grid_size = 80
    for x in range(0, width, grid_size):
        draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 12), width=1)
    for y in range(0, height, grid_size):
        draw.line([(0, y), (width, y)], fill=(255, 255, 255, 12), width=1)
        
    # Draw constellation points & connecting lines
    nodes = []
    import random
    random.seed(42)
    
    for _ in range(60):
        nx = random.randint(50, width - 50)
        ny = random.randint(50, height - 50)
        nodes.append((nx, ny))
        
    # Connect close nodes
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            x1, y1 = nodes[i]
            x2, y2 = nodes[j]
            dist = math.hypot(x2 - x1, y2 - y1)
            if dist < 220:
                alpha = int((1 - dist / 220) * 90)
                draw.line([(x1, y1), (x2, y2)], fill=(16, 185, 129, alpha), width=1)

    # Draw node glowing dots
    for nx, ny in nodes:
        draw.ellipse([nx - 3, ny - 3, nx + 3, ny + 3], fill=(16, 185, 129, 200))
        draw.ellipse([nx - 6, ny - 6, nx + 6, ny + 6], fill=(16, 185, 129, 60))

    # Save clean background image
    target_path = r"c:\Users\shanj\OneDrive\Desktop\SpringWeb Solutions\public\hero-bg.png"
    img.save(target_path, "PNG")
    target_path2 = r"c:\Users\shanj\OneDrive\Desktop\SpringWeb Solutions\public\hero_bg_springweb.png"
    img.save(target_path2, "PNG")
    print("Clean background created successfully!")

if __name__ == "__main__":
    create_hero_bg()
