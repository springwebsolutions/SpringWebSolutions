import math
from PIL import Image, ImageDraw, ImageFilter

def create_hero_bg():
    width = 1920
    height = 1080
    
    # Create base rich dark indigo-black background
    img = Image.new("RGBA", (width, height), (6, 10, 22, 255))
    draw = ImageDraw.Draw(img)
    
    # Add vibrant glowing emerald & cyan radial gradients
    for r in range(600, 0, -8):
        alpha = int((1 - r / 600) * 120)
        draw.ellipse([width/2 - r, height/2 - r, width/2 + r, height/2 + r], fill=(16, 185, 129, alpha))
        
    for r in range(500, 0, -8):
        alpha = int((1 - r / 500) * 110)
        draw.ellipse([width*0.8 - r, height*0.3 - r, width*0.8 + r, height*0.3 + r], fill=(6, 182, 212, alpha))

    for r in range(450, 0, -8):
        alpha = int((1 - r / 450) * 100)
        draw.ellipse([width*0.2 - r, height*0.7 - r, width*0.2 + r, height*0.7 + r], fill=(99, 102, 241, alpha))

    # Draw sharp high-contrast tech grid lines
    grid_size = 60
    for x in range(0, width, grid_size):
        draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 30), width=1)
    for y in range(0, height, grid_size):
        draw.line([(0, y), (width, y)], fill=(255, 255, 255, 30), width=1)
        
    # Draw constellation network points & bright glowing connecting lines
    nodes = []
    import random
    random.seed(101)
    
    for _ in range(80):
        nx = random.randint(30, width - 30)
        ny = random.randint(30, height - 30)
        nodes.append((nx, ny))
        
    # Connect close nodes with bright emerald/cyan lines
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            x1, y1 = nodes[i]
            x2, y2 = nodes[j]
            dist = math.hypot(x2 - x1, y2 - y1)
            if dist < 240:
                alpha = int((1 - dist / 240) * 180)
                stroke = 2 if dist < 120 else 1
                color = (16, 185, 129, alpha) if i % 2 == 0 else (6, 182, 212, alpha)
                draw.line([(x1, y1), (x2, y2)], fill=color, width=stroke)

    # Draw bright node dots
    for i, (nx, ny) in enumerate(nodes):
        dot_color = (52, 211, 153, 255) if i % 2 == 0 else (34, 211, 238, 255)
        glow_color = (16, 185, 129, 120) if i % 2 == 0 else (6, 182, 212, 120)
        draw.ellipse([nx - 4, ny - 4, nx + 4, ny + 4], fill=dot_color)
        draw.ellipse([nx - 10, ny - 10, nx + 10, ny + 10], fill=glow_color)

    # Save clean background image
    target_path = r"c:\Users\shanj\OneDrive\Desktop\SpringWeb Solutions\public\hero-bg.png"
    img.save(target_path, "PNG")
    target_path2 = r"c:\Users\shanj\OneDrive\Desktop\SpringWeb Solutions\public\hero_bg_springweb.png"
    img.save(target_path2, "PNG")
    print("Vivid bright hero background created successfully!")

if __name__ == "__main__":
    create_hero_bg()
