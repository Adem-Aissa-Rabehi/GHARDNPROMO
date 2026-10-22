import os
import cv2
from PIL import Image

video_path = os.path.join('hall', 'Create_video_from_facade_to_202608291225.mp4')
output_dir = os.path.join('public', 'frames')

os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Total frames to extract: {total_frames}")

frame_idx = 0
saved_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    # Convert BGR (OpenCV) to RGB (PIL)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(rgb_frame)
    
    # Resize to 1280x720
    img = img.resize((1280, 720), Image.Resampling.LANCZOS)
    
    filename = f"frame_{frame_idx:03d}.webp"
    filepath = os.path.join(output_dir, filename)
    
    # Save as WebP with 80 quality
    img.save(filepath, "WEBP", quality=80)
    
    frame_idx += 1
    saved_count += 1
    if frame_idx % 30 == 0:
        print(f"Extracted {frame_idx}/{total_frames} frames...")

cap.release()
print(f"Completed! {saved_count} frames saved to {output_dir}")
