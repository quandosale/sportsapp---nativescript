/* not published yet */

Android: https://github.com/spacecowboy/NoNonsense-FilePicker/

copied from library page:
<p>
<img src="https://raw.githubusercontent.com/spacecowboy/NoNonsense-FilePicker/master/screenshots/Nexus6-picker-dark.png"
width="25%"
</img>

<img src="https://raw.githubusercontent.com/spacecowboy/NoNonsense-FilePicker/master/screenshots/Nexus10-picker-dark.png"
width="50%"
</img>
</p>

<p>
<img src="https://raw.githubusercontent.com/spacecowboy/NoNonsense-FilePicker/master/screenshots/Nexus6-picker-light.png"
width="25%"
</img>

<img src="https://raw.githubusercontent.com/spacecowboy/NoNonsense-FilePicker/master/screenshots/Nexus10-picker-light.png"
width="50%"
</img>
</p>




### Include permission in your manifest

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Include the file picker activity

The intent filter is optional depending on your use case. Note that
the theme set in the manifest is important.

```xml
    <activity
       android:name="com.nononsenseapps.filepicker.FilePickerActivity"
       android:label="@string/app_name"
       android:theme="@style/FilePickerTheme">
       <intent-filter>
          <action android:name="android.intent.action.GET_CONTENT" />
          <category android:name="android.intent.category.DEFAULT" />
       </intent-filter>
    </activity>
```

### Configure the theme

You must **set the theme** on the activity, but you can configure it to
match your existing application theme. You can also name it whatever
you like..
```
    </style>

        <style name="FilePickerTheme" parent="NNF_BaseTheme.Light">
        <!-- Set these to match your theme -->
        <item name="colorPrimary">@color/ns_primary</item>
        <item name="colorPrimaryDark">@color/ns_primaryDark</item>
        <item name="colorAccent">@color/ns_accent</item>

        <!-- Setting a divider is entirely optional -->
        <item name="nnf_list_item_divider">?android:attr/listDivider</item>

        <!-- Need to set this also to style create folder dialog -->
        <item name="alertDialogTheme">@style/FilePickerAlertDialogTheme</item>

        <!-- If you want to set a specific toolbar theme, do it here -->
        <!-- <item name="nnf_toolbarTheme">@style/ThemeOverlay.AppCompat.Dark.ActionBar</item> -->
    </style>

    <style name="FilePickerAlertDialogTheme" parent="Theme.AppCompat.Dialog.Alert">
        <item name="colorPrimary">@color/ns_primary</item>
        <item name="colorPrimaryDark">@color/ns_primaryDark</item>
    </style>
```

docs:
  so..oo..on
