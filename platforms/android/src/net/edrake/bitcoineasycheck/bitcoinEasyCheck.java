/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package net.edrake.bitcoineasycheck;

import android.os.Bundle;
import android.widget.LinearLayout;
import android.view.View;

import org.apache.cordova.*;
import com.google.ads.*;
import com.google.analytics.tracking.android.EasyTracker;
import com.google.analytics.tracking.android.Fields;

public class bitcoinEasyCheck extends CordovaActivity {

	private final static String ADMOB_AD_UNIT = "ca-app-pub-8928397865273246/3976829810";
	private AdView adView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")

        // Google AdMob
        adView = new AdView(this, AdSize.BANNER, ADMOB_AD_UNIT); 
        LinearLayout layout = super.root;
        layout.addView(adView); 
        AdRequest request = new AdRequest();
        //request.setTesting(true);
        adView.loadAd(request);
    }

    @Override
    public void onStart() {
      super.onStart();      
      EasyTracker et = EasyTracker.getInstance(this);
	  et.set(Fields.SCREEN_NAME, "Main - Blackberry");
	  et.activityStart(this); // Google analytics
    }

    @Override
    public void onStop() {
      super.onStop();      
      EasyTracker.getInstance(this).activityStop(this); // Google analytics      
    }

}

