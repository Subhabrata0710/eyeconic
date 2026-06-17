import fitz
import os
doc = fitz.open('images/print.pdf')
os.makedirs('images/committee', exist_ok=True)
# Extract all images from pages 9, 11, 13 (0-indexed: 8, 10, 12)
for pg_idx, pg_name in [(8,'p09'),(10,'p11'),(12,'p13')]:
    page = doc[pg_idx]
    images = page.get_images(full=True)
    print(f'Page {pg_idx+1}: {len(images)} images')
    for i, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        ext = base_image['ext']
        imgdata = base_image['image']
        w = base_image['width']
        h = base_image['height']
        fname = f'images/committee/{pg_name}_img{i:02d}.{ext}'
        with open(fname, 'wb') as f:
            f.write(imgdata)
        print(f'  Saved {fname} ({len(imgdata)} bytes, {w}x{h})')