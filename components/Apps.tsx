
import React from 'react';
import { Code, Scale, Stethoscope, Dumbbell, Palette, Calculator, Languages, Music } from 'lucide-react';
import { ChatSession } from '../types';

interface AppsProps {
    onLaunchApp: (appName: string, systemPrompt: string) => void;
}

export const Apps: React.FC<AppsProps> = ({ onLaunchApp }) => {
    const apps = [
        { 
            name: 'Code Wizard', 
            icon: <Code size={32} className="text-blue-500" />, 
            desc: 'Generate, debug, and explain code in any language.',
            prompt: 'You are Code Wizard, an expert software engineer. Help the user write, debug, and understand code.'
        },
        { 
            name: 'Legal Aid AI', 
            icon: <Scale size={32} className="text-amber-600" />, 
            desc: 'Get basic legal definitions and document drafting help.',
            prompt: 'You are Legal Aid AI. Provide general information about legal concepts and help draft simple documents. Disclaimer: You are an AI, not a lawyer.'
        },
        { 
            name: 'Health Bot', 
            icon: <Stethoscope size={32} className="text-red-500" />, 
            desc: 'Symptom checker and wellness tips.',
            prompt: 'You are Health Bot. Help users understand general health symptoms and provide wellness tips. Disclaimer: Not a doctor, seek professional help for emergencies.'
        },
        { 
            name: 'FitCoach', 
            icon: <Dumbbell size={32} className="text-green-500" />, 
            desc: 'Personalized workout plans and diet advice.',
            prompt: 'You are FitCoach. Create workout plans and meal prep ideas for the user.'
        },
        { 
            name: 'Art Muse', 
            icon: <Palette size={32} className="text-purple-500" />, 
            desc: 'Creative writing and art prompts.',
            prompt: 'You are Art Muse. Help the user with creative writing, poetry, and generating art prompts.'
        },
        { 
            name: 'Math Tutor', 
            icon: <Calculator size={32} className="text-orange-500" />, 
            desc: 'Step-by-step math problem solver.',
            prompt: 'You are Math Tutor. Solve math problems step-by-step and explain the concepts.'
        },
        { 
            name: 'Polyglot', 
            icon: <Languages size={32} className="text-cyan-500" />, 
            desc: 'Real-time translation and language learning.',
            prompt: 'You are Polyglot. Help the user learn languages and translate text.'
        },
        { 
            name: 'Music Gen', 
            icon: <Music size={32} className="text-pink-500" />, 
            desc: 'Lyrics writing and chord progression ideas.',
            prompt: 'You are Music Gen. Write song lyrics and suggest chord progressions.'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">App Store</h2>
            <p className="text-gray-500 mb-8">Discover AI-powered micro-apps for every need.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {apps.map((app, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                         onClick={() => onLaunchApp(app.name, app.prompt)}>
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                            {app.icon}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{app.name}</h3>
                        <p className="text-sm text-gray-500">{app.desc}</p>
                        <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Open App
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
