@del signature-pad-release.aar
@copy "..\native_script2\!!  line chart\android-signaturepad-master\signature-pad\build\outputs\aar\signature-pad-release.aar" signature-pad-release.aar
@copy node_modules\nativescript-drawingpad\platforms\android\signature-pad-release.aar signature-pad-release_backup.aar
@del node_modules\nativescript-drawingpad\platforms\android\signature-pad-release.aar
@echo Draw Module
@IF NOT EXIST "node_modules\nativescript-drawingpad\platforms\android\signature-pad-release.aar" (
echo ======================= deleted success==========================
) ELSE (
echo ======================= deleted fail==========================
)
@copy signature-pad-release.aar node_modules\nativescript-drawingpad\platforms\android\

@IF EXIST "node_modules\nativescript-drawingpad\platforms\android\signature-pad-release.aar" (
echo ======================= copy success==========================
) ELSE (
echo ======================= copy fail==========================
)