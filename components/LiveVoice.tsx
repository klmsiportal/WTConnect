import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, X, Activity } from 'lucide-react';

interface LiveVoiceProps {
  onClose: () => void;
}

export const LiveVoice: React.FC<LiveVoiceProps> = ({ onClose }) => {
  const [connected, setConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    let cleanup = () => {};
    
    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        // Audio Setup
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 24000 
        });
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Connect Live API
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setConnected(true);
              
              // Input Stream
              const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
              const source = inputCtx.createMediaStreamSource(stream);
              const processor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Convert to PCM 16-bit
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    pcmData[i] = inputData[i] * 32768;
                }
                
                // Base64 encode
                let binary = '';
                const bytes = new Uint8Array(pcmData.buffer);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const b64 = btoa(binary);

                sessionPromise.then(session => {
                    session.sendRealtimeInput({
                        media: { mimeType: 'audio/pcm;rate=16000', data: b64 }
                    });
                });
              };
              
              source.connect(processor);
              processor.connect(inputCtx.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
                const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData && audioContextRef.current) {
                    const binaryString = atob(audioData);
                    const bytes = new Uint8Array(binaryString.length);
                    for(let i=0; i<binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
                    
                    const audioBuffer = await decodeAudioData(bytes, audioContextRef.current);
                    const source = audioContextRef.current.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContextRef.current.destination);
                    source.start();
                }
            },
            onclose: () => setConnected(false),
            onerror: (e) => console.error(e)
          },
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
            },
            systemInstruction: "You are a helpful, witty voice assistant for WTConnect social network."
          }
        });
        
        sessionRef.current = sessionPromise;

      } catch (e) {
        console.error("Live Voice Error", e);
      }
    };

    startSession();

    return () => {
        if (sessionRef.current) {
            sessionRef.current.then((s: any) => s.close());
        }
        if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext) {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 text-white p-8">
        <div className="relative">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${connected ? 'border-indigo-500 animate-pulse' : 'border-gray-600'}`}>
                <Activity size={48} className={connected ? 'text-indigo-400' : 'text-gray-500'} />
            </div>
            {connected && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                    LIVE
                </div>
            )}
        </div>
        
        <div className="text-center">
            <h2 className="text-2xl font-bold">WTConnect Voice</h2>
            <p className="text-gray-400">Listening...</p>
        </div>

        <div className="flex gap-6 mt-8">
            <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`p-4 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button 
                onClick={onClose} 
                className="p-4 rounded-full bg-red-600 hover:bg-red-700"
            >
                <X size={24} />
            </button>
        </div>
      </div>
    </div>
  );
};
