#!/usr/bin/env python3
"""Create an offline VSIX package without installing a packaging tool."""
import json
from pathlib import Path
import zipfile
from xml.sax.saxutils import escape

ROOT=Path(__file__).resolve().parents[1]
EXT=ROOT/'extensions/roc-lineage'


def package(destination=None):
    meta=json.loads((EXT/'package.json').read_text())
    destination=Path(destination) if destination else ROOT/'dist'/f'{meta["name"]}-{meta["version"]}.vsix'
    destination.parent.mkdir(parents=True,exist_ok=True)
    manifest=f'''<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
<Metadata><Identity Language="en-US" Id="{escape(meta['name'])}" Version="{escape(meta['version'])}" Publisher="{escape(meta['publisher'])}"/>
<DisplayName>{escape(meta['displayName'])}</DisplayName><Description xml:space="preserve">{escape(meta['description'])}</Description>
<Tags>ai,lineage,roc</Tags><Categories>Visualization</Categories><GalleryFlags>Public</GalleryFlags>
<Properties><Property Id="Microsoft.VisualStudio.Code.Engine" Value="{escape(meta['engines']['vscode'])}"/><Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value=""/><Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="workspace"/></Properties></Metadata>
<Installation><InstallationTarget Id="Microsoft.VisualStudio.Code"/></Installation><Dependencies/>
<Assets><Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/>
<Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true"/>
<Asset Type="Microsoft.VisualStudio.Services.Content.License" Path="extension/LICENSE" Addressable="true"/></Assets></PackageManifest>'''
    content_types='''<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="json" ContentType="application/json"/><Default Extension="cjs" ContentType="application/javascript"/><Default Extension="js" ContentType="application/javascript"/><Default Extension="css" ContentType="text/css"/><Default Extension="md" ContentType="text/markdown"/><Default Extension="jsonl" ContentType="text/plain"/><Default Extension="vsixmanifest" ContentType="text/xml"/><Default Extension="" ContentType="text/plain"/></Types>'''
    with zipfile.ZipFile(destination,'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('extension.vsixmanifest',manifest)
        z.writestr('[Content_Types].xml',content_types)
        z.write(ROOT/'LICENSE','extension/LICENSE')
        for name in ['package.json','README.md']:
            z.write(EXT/name,'extension/'+name)
        for directory in ['src','media','samples']:
            for p in sorted((EXT/directory).rglob('*')):
                if p.is_file(): z.write(p,'extension/'+str(p.relative_to(EXT)))
    return destination


if __name__=='__main__': print(package())
