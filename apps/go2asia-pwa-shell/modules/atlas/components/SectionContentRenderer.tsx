'use client';

import React from 'react';
import { 
  MapPin, Clock, DollarSign, Star, Camera, 
  Sun, Droplet, Utensils, Coffee, Building2,
  Sparkles, Info, Lightbulb, History, Navigation
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Map emojis to lucide-react icons
const emojiToIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  '🌟': Star,
  '⭐': Star,
  '📸': Camera,
  '🏛️': Building2,
  '🏯': Building2,
  '👑': Sparkles,
  '🧱': Building2,
  '🌿': Droplet,
  '💰': DollarSign,
  '💵': DollarSign,
  '💴': DollarSign,
  '💶': DollarSign,
  '💷': DollarSign,
  '🎟️': DollarSign,
  '⏱️': Clock,
  '🕐': Clock,
  '🕑': Clock,
  '🕒': Clock,
  '🌞': Sun,
  '☀️': Sun,
  '👟': Utensils,
  '☂️': Droplet,
  '💧': Droplet,
  '🚶': Navigation,
  '🚶‍♂️': Navigation,
  '🚶‍♀️': Navigation,
  '🚕': Navigation,
  '🚌': Navigation,
  '🚤': Navigation,
  '🚣': Navigation,
  '🌉': Building2,
  '🌃': Sun,
  '🌇': Sun,
  '🌅': Sun,
  '🌄': Sun,
  '📷': Camera,
  '🧘': Info,
  '💡': Lightbulb,
  '📚': Info,
  '🏷️': Info,
  '📍': MapPin,
  '🗺️': MapPin,
  '🌐': Navigation,
  '📱': Info,
  '☕': Coffee,
  '🍜': Utensils,
  '🍲': Utensils,
  '🍛': Utensils,
};

// Extract emoji from line start
function extractEmoji(line: string): { emoji: string | null; text: string } {
  const emojiMatch = line.match(/^([\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}])/u);
  if (emojiMatch) {
    return { emoji: emojiMatch[1], text: line.slice(emojiMatch[1].length).trim() };
  }
  return { emoji: null, text: line };
}

// Parse pricing patterns: "💰 Входной билет: ~150 000 VND"
function parsePricing(text: string): { price: string; label: string } | null {
  const priceMatch = text.match(/(?:💰|💵|💴|💶|💷|🎟️)\s*(.+?):\s*(.+)/);
  if (priceMatch) {
    return { label: priceMatch[1].trim(), price: priceMatch[2].trim() };
  }
  // Fallback: just price
  const simplePrice = text.match(/(?:💰|💵|💴|💶|💷|🎟️)\s*(.+)/);
  if (simplePrice) {
    return { label: 'Цена', price: simplePrice[1].trim() };
  }
  return null;
}

// Parse time patterns: "⏱️ Осмотр: минимум 2–3 часа"
function parseTime(text: string): { time: string; label: string } | null {
  const timeMatch = text.match(/(?:⏱️|🕐|🕑|🕒)\s*(.+?):\s*(.+)/);
  if (timeMatch) {
    return { label: timeMatch[1].trim(), time: timeMatch[2].trim() };
  }
  // Fallback: just time
  const simpleTime = text.match(/(?:⏱️|🕐|🕑|🕒)\s*(.+)/);
  if (simpleTime) {
    return { label: 'Время', time: simpleTime[1].trim() };
  }
  return null;
}

interface SectionContentRendererProps {
  markdown: string;
  sectionKey?: string;
}

export function SectionContentRenderer({ markdown, sectionKey }: SectionContentRendererProps) {
  if (!markdown) return null;

  const lines = markdown.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  // Check if this is a pricing section
  const isPricingSection = sectionKey === 'tickets' || sectionKey === 'prices';
  // Check if this is a time allocation section
  const isTimeSection = sectionKey === 'timeAllocation';
  
  // Parse lists with emojis
  const items: Array<{ emoji: string | null; icon: React.ComponentType<{ className?: string }> | null; text: string; isPricing?: { price: string; label: string }; isTime?: { time: string; label: string } }> = [];
  
  for (const line of lines) {
    // Skip headers
    if (line.startsWith('#')) continue;
    
    // Check for list items
    const listMatch = line.match(/^[-•*]\s*(.+)$/);
    if (listMatch) {
      const content = listMatch[1].trim();
      const { emoji, text } = extractEmoji(content);
      
      // Try to parse as pricing
      const pricing = isPricingSection ? parsePricing(content) : null;
      // Try to parse as time
      const time = isTimeSection ? parseTime(content) : null;
      
      const Icon = emoji && emojiToIcon[emoji] ? emojiToIcon[emoji] : null;
      
      items.push({
        emoji,
        icon: Icon,
        text: pricing ? pricing.label : time ? time.label : text,
        isPricing: pricing || undefined,
        isTime: time || undefined,
      });
    }
  }

  // If we have structured items, render them with icons
  if (items.length > 0) {
    return (
      <div className="space-y-3">
        {items.map((item, idx) => {
          // Pricing accent block
          if (item.isPricing) {
            return (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white border-2 border-sky-200 shadow-sm">
                <div className="flex-shrink-0 mt-0.5">
                  <DollarSign className="w-5 h-5 text-sky-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{item.isPricing.label}</div>
                  <div className="text-lg font-semibold text-sky-700 mt-1">{item.isPricing.price}</div>
                </div>
              </div>
            );
          }
          
          // Time accent block
          if (item.isTime) {
            return (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white border-2 border-emerald-200 shadow-sm">
                <div className="flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{item.isTime.label}</div>
                  <div className="text-lg font-semibold text-emerald-700 mt-1">{item.isTime.time}</div>
                </div>
              </div>
            );
          }
          
          // Regular list item with icon
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              {Icon ? (
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>
              ) : item.emoji ? (
                <div className="flex-shrink-0 mt-0.5 text-base">{item.emoji}</div>
              ) : (
                <div className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400" />
              )}
              <div className="flex-1 text-slate-700">{item.text}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback to regular markdown renderer
  return (
    <div className="prose prose-sm max-w-none prose-slate">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
