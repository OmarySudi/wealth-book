package com.sudiomary.ExpenseIncomeBook;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import java.util.ArrayList;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {

    // // Initializes the Bridge
    // this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
    //   // Additional plugins you've installed go here
    //   // Ex: add(TotallyAwesomePlugin.class);
    //   add(GoogleAuth.class);
    // }});

    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        registerPlugin(GoogleAuth.class);
    }
}
