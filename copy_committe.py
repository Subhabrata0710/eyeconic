import shutil, os
# Final mapping: source file -> shorthand name
mapping = {
    'images/committee/p09_img00.png': 'images/lv.png',       # Dr Lalit Verma
    'images/committee/p11_img00.png': 'images/bks.png',      # Dr Brajendra K Sarkar
    'images/committee/p11_img02.png': 'images/dd.png',       # Dr Debashis Das
    'images/committee/p11_img03.png': 'images/gkm.png',      # Dr Gautam K Mitra
    'images/committee/p13_img13.png': 'images/jp.png',       # Dr Juthika Pal
    'images/committee/p13_img15.png': 'images/nj.png',       # Dr Navin Jayakumar
    'images/committee/p13_img20.png': 'images/ra.png',       # Dr Rupa Adhikari
    'images/committee/p11_img08.png': 'images/santm.png',    # Dr Santanu Mitra
    'images/committee/p13_img21.png': 'images/sps.png',      # Dr Sanjeev P Srinivas
    'images/committee/p11_img09.png': 'images/sjdm.png',     # Dr S J Datta Mazumder
    'images/committee/p13_img24.png': 'images/skr.png',      # Dr Srinivas K Rao
    'images/committee/p13_img03.png': 'images/sriram.png',   # Dr Sriram Ramalingam
    'images/committee/p13_img05.png': 'images/sbm.png',      # Dr Subrata Mandal
    'images/committee/p13_img07.png': 'images/sgp.png',      # Dr Sugato Paul
    'images/committee/p13_img02.png': 'images/ab.png',       # Dr Amitava Biswas
    'images/committee/p13_img11.png': 'images/nb.png',       # Ms Neena Biswas
}
for src, dst in mapping.items():
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f'Copied: {src} -> {dst}')
    else:
        print(f'MISSING: {src}')
print('Done!')