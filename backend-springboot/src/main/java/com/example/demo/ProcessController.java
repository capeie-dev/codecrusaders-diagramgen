package com.example.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class ProcessController {

    private Map<String, String> processStatus = new ConcurrentHashMap<>();

    @PostMapping("/start-process")
    public ResponseEntity<String> startProcess(@RequestBody ProcessRequest request) {
        String processId = UUID.randomUUID().toString();
        processStatus.put(processId, "PROCESSING");

        new Thread(() -> {
            try {
                Thread.sleep(5000);
                processStatus.put(processId, "SUCCESS");
            } catch (InterruptedException e) {
                processStatus.put(processId, "FAILED");
            }
        }).start();

        return ResponseEntity.ok(processId);
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<String> getStatus(@PathVariable String id) {
        return ResponseEntity.ok(processStatus.getOrDefault(id, "UNKNOWN"));
    }

    static class ProcessRequest {
        public String inputCode;
    }
}
