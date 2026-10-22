import os
import shutil
import glob

os.makedirs('public', exist_ok=True)
os.makedirs('public/lobby', exist_ok=True)

# Copy logo
if os.path.exists('GHARDN PROM.png'):
    shutil.copy('GHARDN PROM.png', 'public/GHARDN PROM.png')
    shutil.copy('GHARDN PROM.png', 'public/logo.png')
    print("Logo copied!")

# Copy video
video_src = os.path.join('hall', 'Create_video_from_facade_to_202608291225.mp4')
if os.path.exists(video_src):
    shutil.copy(video_src, 'public/facade_to_lobby.mp4')
    print("Video copied to public/facade_to_lobby.mp4!")

# Copy lobby images
lobby_images = sorted(glob.glob('hall/*.jpeg'))
for idx, img in enumerate(lobby_images):
    dest = os.path.join('public', 'lobby', f'lobby_{idx+1:02d}.jpeg')
    shutil.copy(img, dest)

print(f"Copied {len(lobby_images)} lobby photos to public/lobby/")
