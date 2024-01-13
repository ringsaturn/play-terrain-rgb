# Play terrain rgb

Follow: <https://github.com/syncpoint/terrain-rgb>

---

```bash
brew install gdal geoip libspatialite librasterlite spatialite-gui spatialite-tools
```

```bash
pip install rasterio --no-binary rasterio
pip install -r requirements.txt
```

Mt Everest `86.922623,27.986065`

```bash
rio info --indent 2 ASTGTMV003_N27E086_dem.tif
```

Output:

```json
{
  "blockxsize": 256,
  "blockysize": 256,
  "bounds": [
    85.9998611111111,
    26.99986111111112,
    87.00013888888888,
    28.0001388888889
  ],
  "colorinterp": [
    "gray"
  ],
  "compress": "lzw",
  "count": 1,
  "crs": "EPSG:4326",
  "descriptions": [
    "Band 1"
  ],
  "driver": "GTiff",
  "dtype": "int16",
  "height": 3601,
  "indexes": [
    1
  ],
  "interleave": "band",
  "lnglat": [
    86.5,
    27.500000000000007
  ],
  "mask_flags": [
    [
      "all_valid"
    ]
  ],
  "nodata": null,
  "res": [
    0.000277777777777778,
    0.000277777777777778
  ],
  "shape": [
    3601,
    3601
  ],
  "tiled": true,
  "transform": [
    0.000277777777777778,
    0.0,
    85.9998611111111,
    0.0,
    -0.000277777777777778,
    28.0001388888889,
    0.0,
    0.0,
    1.0
  ],
  "units": [
    null
  ],
  "width": 3601
}
```

```bash
gdalwarp 
    -t_srs EPSG:3857 
    -dstnodata None 
    -novshiftgrid
    -co TILED=YES 
    -co COMPRESS=DEFLATE 
    -co BIGTIFF=IF_NEEDED
    -r lanczos
    ./ASTGTMV003_N27E086_dem.tif 
    ASTGTMV003_N27E086_dem_EPSG3857.tif
```

```bash
gdalwarp -t_srs EPSG:3857  -dstnodata None  -novshiftgrid -co TILED=YES  -co COMPRESS=DEFLATE  -co BIGTIFF=IF_NEEDED -r lanczos ASTGTMV003_N27E086_dem.tif  ASTGTMV003_N27E086_dem_EPSG3857.tif
```

```
Creating output file that is 3379P x 3810L.
Processing ASTGTMV003_N27E086_dem.tif [1/1] : 0...10...20...30...40...50...60...70...80...90...100 - done.
```

```bash
rio info --indent 2 ASTGTMV003_N27E086_dem_EPSG3857.tif
```

```json
{
  "blockxsize": 256,
  "blockysize": 256,
  "bounds": [
    9573460.747181138,
    3123448.7161612394,
    9684801.532496996,
    3248991.3003735566
  ],
  "colorinterp": [
    "gray"
  ],
  "compress": "deflate",
  "count": 1,
  "crs": "EPSG:3857",
  "descriptions": [
    "Band 1"
  ],
  "driver": "GTiff",
  "dtype": "int16",
  "height": 3810,
  "indexes": [
    1
  ],
  "interleave": "band",
  "lnglat": [
    86.49995675708664,
    27.501113742296546
  ],
  "mask_flags": [
    [
      "all_valid"
    ]
  ],
  "nodata": null,
  "res": [
    32.95080950454515,
    32.95080950454515
  ],
  "shape": [
    3810,
    3379
  ],
  "tiled": true,
  "transform": [
    32.95080950454515,
    0.0,
    9573460.747181138,
    0.0,
    -32.95080950454515,
    3248991.3003735566,
    0.0,
    0.0,
    1.0
  ],
  "units": [
    null
  ],
  "width": 3379
}
```

```bash
rio rgbify  -b -10000  -i 0.1 ASTGTMV003_N27E086_dem_EPSG3857.tif ASTGTMV003_N27E086_dem_EPSG3857.RGB.tif
```

Try read original height

```bash
gdallocationinfo -wgs84 ASTGTMV003_N27E086_dem.tif 86.92500829696657 27.988243465288956
```

```console
Report:
  Location: (3330P,42L)
  Band 1:
    Value: 8798
```

```bash
gdallocationinfo -wgs84 ASTGTMV003_N27E086_dem_EPSG3857.RGB.tif 86.92500829696657 27.988243465288956
```

```console
Report:
  Location: (3125P,45L)
  Band 1:
    Value: 2
  Band 2:
    Value: 222
  Band 3:
    Value: 56
```

Formula as:

```py
height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
```

So:

```py
height = -10000 + ((2 * 256 * 256 + 222 * 256 + 56) * 0.1)
# 8796
```

```bash
time gdal2tiles.py --zoom=5-15 --processes=16 ASTGTMV003_N27E086_dem_EPSG3857.RGB.tif ./tiles
```

```console
(play-terrain-rgb) ➜  play-terrain-rgb git:(main) ✗ time gdal2tiles.py --zoom=5-15 --processes=16 ASTGTMV003_N27E086_dem_EPSG3857.RGB.tif ./tiles
Generating Base Tiles:
0/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
/opt/homebrew/lib/python3.12/site-packages/osgeo/osr.py:410: FutureWarning: Neither osr.UseExceptions() nor osr.DontUseExceptions() has been explicitly called. In GDAL 4.0, exceptions will be enabled by default.
  warnings.warn(
...10...20...30...40...50...60...70...80...90...100 - done.
Generating Overview Tiles:
0...10...20...30...40...50...60...70...80...90...100 - done.
gdal2tiles.py --zoom=5-15 --processes=16  ./tiles  132.77s user 15.79s system 1206% cpu 12.311 total
```

```bash
mb-util --image_format=png --scheme=tms ./tiles/ ./ASTGTMV003_N27E086_dem_EPSG3857.RGB.mbtiles
```

```console
12900 tiles inserted (17696 tiles/sec)mb-util --image_format=png --scheme=tms ./tiles/   0.32s user 1.18s system 75% cpu 1.970 total
```
