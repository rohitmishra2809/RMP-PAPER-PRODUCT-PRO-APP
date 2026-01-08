
import React, { useState, useEffect } from 'react';
import { Inventory, UserSession, OrderData } from '../types';
import GlassCard from './GlassCard';
// Fix: Added missing MessageSquare icon import
import { ShoppingBag, Send, AlertTriangle, HelpCircle, X, Loader2, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CustomerPanelProps {
  session: UserSession;
  inventory: Inventory;
}

const CustomerPanel: React.FC<CustomerPanelProps> = ({ session, inventory }) => {
  const [formData, setFormData] = useState<OrderData>({
    item: '14 Inch Thali',
    gsm: '120 GSM',
    color: 'Green',
    bags: 10,
    pcs: 20,
    deadline: new Date().toISOString().split('T')[0],
    note: ''
  });

  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const isAvailable = inventory[formData.gsm][formData.color];

  const handleGenerateWhatsApp = () => {
    if (!isAvailable) return;

    const waNumber = "919998471567";
    const message = `*🏭 NEW ORDER - ${session.name.toUpperCase()}*
-----------------------------
*Customer:* ${session.name}
*Phone:* ${session.phone}
-----------------------------
*Item:* ${formData.item}
*Spec:* ${formData.gsm} | ${formData.color}
*Qty:* ${formData.bags} Bags (${formData.pcs} pcs/pkt)
*Deadline:* ${formData.deadline}
*Note:* ${formData.note || 'None'}
    `;

    const encodedMsg = encodeURIComponent(message);
    const waLink = `https://wa.me/${waNumber}?text=${encodedMsg}`;
    window.open(waLink, '_blank');
  };

  const askAiAssistant = async () => {
    setIsAiLoading(true);
    setShowAiModal(true);
    try {
      // Initialize GoogleGenAI inside the function with named parameter apiKey.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using gemini-3-flash-preview for basic text advice tasks as per guidelines.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert sales assistant for RMP Paper Products. A customer is looking at: 
        Item: ${formData.item}, GSM: ${formData.gsm}, Color: ${formData.color}. 
        They want to know if this is a good choice or what else they should consider for different types of meals (e.g., weddings, snacks, heavy meals). 
        Keep it professional, helpful, and concise (under 100 words).`,
      });
      // Correctly access the .text property of GenerateContentResponse.
      setAiResponse(response.text || "I couldn't generate advice right now. Please try again later.");
    } catch (error) {
      setAiResponse("Sorry, our AI expert is currently busy. Please call RMP support.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GlassCard className="lg:col-span-2 p-8">
        <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800 mb-6">
          <ShoppingBag className="w-6 h-6 text-indigo-600" />
          Create New Order
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Select Item</span>
              <select 
                value={formData.item}
                onChange={(e) => setFormData({...formData, item: e.target.value})}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
              >
                <option>14 Inch Thali</option>
                <option>Paper Bowl (Dona)</option>
                <option>Partition Plate</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">GSM Specification</span>
              <select 
                value={formData.gsm}
                onChange={(e) => setFormData({...formData, gsm: e.target.value})}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
              >
                <option>120 GSM</option>
                <option>200 GSM</option>
                <option>300 GSM</option>
              </select>
            </label>

            <div className="block">
              <span className="text-sm font-semibold text-gray-700">Color Choice</span>
              <div className="flex gap-4 mt-1">
                {['Green', 'Silver'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFormData({...formData, color: c as any})}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${
                      formData.color === c 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Bags Qty</span>
                <input 
                  type="number"
                  min="1"
                  value={formData.bags}
                  onChange={(e) => setFormData({...formData, bags: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Pcs/Pkt</span>
                <input 
                  type="number"
                  min="10"
                  value={formData.pcs}
                  onChange={(e) => setFormData({...formData, pcs: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Required Deadline</span>
              <input 
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Custom Design / Notes</span>
              <textarea 
                placeholder="Any special instructions..."
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
              />
            </label>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          {!isAvailable && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg font-bold w-full md:w-auto">
              <AlertTriangle className="w-5 h-5" />
              This item is currently out of stock.
            </div>
          )}
          
          <div className="flex-1" />
          
          <button
            onClick={handleGenerateWhatsApp}
            disabled={!isAvailable}
            className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all shadow-lg ${
              isAvailable 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-100' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
            Send to Manufacturer
          </button>
        </div>
      </GlassCard>

      <GlassCard className="p-8 flex flex-col justify-center text-center">
        <div className="mb-6 p-4 bg-indigo-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
          <HelpCircle className="w-10 h-10 text-indigo-600" />
        </div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">Unsure about Quality?</h4>
        <p className="text-gray-600 mb-8">Our AI Assistant can help you choose the right GSM for your occasion based on the durability you need.</p>
        
        <button 
          onClick={askAiAssistant}
          className="bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-md flex items-center justify-center gap-2"
        >
          {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
          Get Product Advice
        </button>
      </GlassCard>

      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <GlassCard className="w-full max-w-lg p-8 relative">
            <button 
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Loader2 className={`w-6 h-6 text-indigo-600 ${isAiLoading ? 'animate-spin' : ''}`} />
                AI Sales Assistant
            </h3>
            <div className="prose prose-indigo">
              {isAiLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6"></div>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed font-medium">
                  {aiResponse}
                </p>
              )}
            </div>
            {!isAiLoading && (
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Got it, thanks!
                </button>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default CustomerPanel;
