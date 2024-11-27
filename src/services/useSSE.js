import { fetchEventSource } from "@microsoft/fetch-event-source";

export function SubscribeSSE(
    method,
    headers,
    body,
    onOpen,
    onMessage,
    onClose,
    onError,
) {
    let controller = null;

    async function subscribe(url) {
        // Abort any existing subscription
        if (controller) {
            controller.abort();
        }

        // Create a new AbortController
        controller = new AbortController();
        const signal = controller.signal;

        try {
            let sseconfig = {
                method: method,
                signal: controller.signal,
                ...(headers !== null && { headers }),
                ...(body !== null && { body }),
                async onopen(event) {
                    if (signal.aborted) {
                        return;
                    }
                    await onOpen(event);
                },
                async onmessage(event) {
                    if (signal.aborted) {
                        return;
                    }
                    await onMessage(event);
                },
                async onclose() { 
                    await onClose(); 
                    controller.abort(); 
                },
                async onerror(err) { 
                    await onError(err); 
                    controller.abort(); 
                    throw err; 
                },
            };

            console.log('Subscribing to SSE:', url);
            await fetchEventSource(url, sseconfig);
        } catch (err) {
            console.error('fetchEventSource error:', err);
            await onError(err);
            controller.abort();
        }
    }

    function unsubscribe() {
        if (controller) {
            controller.abort();
            console.log('SSE subscription unsubscribed.');
        }
    }

    return {
        subscribe,
        unsubscribe
    };
}