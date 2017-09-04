@echo off

REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\moe.winneon.watchwithmpv" /ve /t REG_SZ /d "%~dp0moe.winneon.watchwithmpv.json" /f
pause
