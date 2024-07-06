"use client";

import { useEffect } from "react";

const VoiceFlowChat = (props: any) => {
  useEffect(() => {
    let chat = document.getElementById("voiceflow-chat");
    if (chat) {
      chat.style.display = "block";
    } else {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `
          (function(d, t) {
        var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
        v.onload = function() {
          window.voiceflow.chat.load({
            verify: { projectID: '65a359906b9bc16300c00ac3' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production'
          });
        }
        v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
    })(document, 'script');
        `;

      document.body.appendChild(script);
    }

    return () => {
      let chat = document.getElementById("voiceflow-chat");
      if (chat) {
        chat.style.display = "none";
      }
    };
  }, []);
  return <>{props.children}</>;
};

export default VoiceFlowChat;
