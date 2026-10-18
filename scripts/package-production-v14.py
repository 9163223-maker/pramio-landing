from pathlib import Path
import json,hashlib,zipfile
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'release-manifests/production-files-v14.json').read_text())
required=['index.html','.htaccess','send.php','scheduled-article.php','sitemap-live.php','sitemap.xml','blog/tetya-lida/index.php','content-queue/articles.json','portfolio/index.html','portfolio/landing-demo/index.html']
assert all(p in manifest for p in required)
assert all(not p.startswith('/') and '..' not in Path(p).parts and not p.endswith('.zip') and p!='config.local.php' for p in manifest)
for p,sha in manifest.items():assert hashlib.sha256((root/p).read_bytes()).hexdigest()==sha,p
archive=root/'PRAMIO-PRODUCTION-2026-10-18-V14-2-TEXT.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(manifest):
  info=zipfile.ZipInfo(p,(2026,10,18,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,(root/p).read_bytes())
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert len(z.namelist())==len(set(z.namelist()))==len(manifest)
 assert set(z.namelist())==set(manifest)
 for p,sha in manifest.items():assert hashlib.sha256(z.read(p)).hexdigest()==sha,p
sha=hashlib.sha256(archive.read_bytes()).hexdigest()
(root/'PRAMIO-PRODUCTION-2026-10-18-V14-2-TEXT.sha256').write_text(sha+'  '+archive.name+'\n')
print(f'{len(manifest)} files, SHA-256 {sha}')
