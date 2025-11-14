import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Languages, FileText } from 'lucide-react';
import TranslationTab from '../components/chatbot/TranslationTab';
import SummarizationTab from '../components/chatbot/SummarizationTab';
import { cn } from '../utils/helpers';

export default function Chatbot() {
  const tabs = [
    { name: 'Translation', icon: Languages, component: TranslationTab },
    { name: 'Summarization', icon: FileText, component: SummarizationTab },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Chatbot</h1>
        <p className="text-gray-600 mt-1">
          Translate text between 50+ languages or summarize long documents
        </p>
      </div>

      {/* Tabbed Interface */}
      <div className="card">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-primary-50 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  cn(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-primary-600 hover:bg-white/[0.12] hover:text-primary-700'
                  )
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </div>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            {tabs.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className={cn(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                <tab.component />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Languages className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Translation</h3>
              <p className="text-sm text-gray-600">
                Translate text between 50+ languages including English, French, Arabic, Spanish, 
                German, Chinese, Japanese, and many more. Powered by mBART-50 AI model.
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Summarization</h3>
              <p className="text-sm text-gray-600">
                Automatically summarize long documents, articles, or texts into concise paragraphs. 
                Perfect for quick understanding of lengthy content. Powered by BART AI model.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}