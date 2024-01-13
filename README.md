# Play terrain rgb

```bash
brew install gdal geoip libspatialite librasterlite spatialite-gui spatialite-tools
```

```bash
pip install rasterio --no-binary rasterio
pip install -r requirements.txt
```

Mt Everest `86.9305,27.9869`

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
