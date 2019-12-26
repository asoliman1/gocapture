package com.adobe.phonegap.push;

import android.util.Log;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

import io.intercom.android.sdk.push.IntercomPushClient;

public class PushInstanceIDListenerService extends FirebaseInstanceIdService implements PushConstants {
    public static final String LOG_TAG = "Push_InsIdService";
    private final IntercomPushClient intercomPushClient = new IntercomPushClient();

    @Override
    public void onTokenRefresh() {
        // Get updated InstanceID token.
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();
        Log.d(LOG_TAG, "Refreshed token: " + refreshedToken);
        // TODO: Implement this method to send any registration to your app's servers.
        //sendRegistrationToServer(refreshedToken);
        intercomPushClient.sendTokenToIntercom(getApplication(), refreshedToken);

    }


}
