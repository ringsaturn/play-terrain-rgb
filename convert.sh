gdalwarp -t_srs EPSG:3857  -dstnodata None  -novshiftgrid -co TILED=YES  -co COMPRESS=DEFLATE  -co BIGTIFF=IF_NEEDED -r lanczos ASTGTMV003_N27E086_dem.tif  ASTGTMV003_N27E086_dem_EPSG3857.tif
