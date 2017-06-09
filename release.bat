REM keytool -genkey -v -keystore sports.keystore -alias "google" -keyalg RSA -keysize 2048 -validity 10000

REM password:123456

REM ------------------------------ config -----------------------------------

REM Enter keystore password:123456
REM Re-enter new password:123456
REM What is your first and last name?
REM [Unknown]:  wbit sale
REM What is the name of your organizational unit?
REM   [Unknown]:  wbitsale
REM What is the name of your organization?
REM   [Unknown]:  wbit
REM What is the name of your City or Locality?
REM   [Unknown]:  china liaoning
REM What is the name of your State or Province?
REM   [Unknown]:  shenyang
REM What is the two-letter country code for this unit?
REM   [Unknown]:  CN
REM Is CN=wbit sale, OU=wbitsale, O=wbit, L=china liaoning, ST=shenyang, C=CN correct?
REM   [no]:  yes

REM Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10,000 days
REM         for: CN=wbit sale, OU=wbitsale, O=wbit, L=china liaoning, ST=shenyang, C=CN
REM Enter key password for <google>
REM         (RETURN if same as keystore password):
REM Re-enter new password:
REM [Storing sports.keystore]

tns build android --release --key-store-path sports.keystore --key-store-password 123456 --key-store-alias google --key-store-alias-password 123456