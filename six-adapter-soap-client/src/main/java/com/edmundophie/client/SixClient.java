package com.edmundophie.client;

import com.edmundophie.adapter.IOException_Exception;
import com.edmundophie.adapter.SixAdapter;
import com.edmundophie.adapter.SixAdapterService;

import javax.xml.ws.WebServiceRef;
import java.util.Scanner;

/**
 * Created by edmundophie on 9/20/15.
 */
public class SixClient {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Kode program studi:");
        String ps = scanner.next();
        System.out.print("Kode mata kuliah:");
        String classCode = scanner.next();
        System.out.print("Nomor kelas:");
        int classNumber = scanner.nextInt();
        System.out.println("Fetching result...");
        System.out.println(getClassParticipants(ps, classCode, classNumber));
    }

    private static String getClassParticipants(String ps, String classCode, int classNumber) {
        SixAdapter port = new SixAdapterService().getSixAdapterPort();
        String result = null;
        try {
            result = port.getClassParticipants(ps, classCode, classNumber);
        } catch (IOException_Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
