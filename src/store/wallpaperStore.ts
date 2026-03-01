import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeName, AvatarType, AvatarStyle } from '@/types/wallpaper';

interface WallpaperState {
    theme: ThemeName;
    avatarType: AvatarType;
    avatarStyle: AvatarStyle;
    customMessage: string;
    generatedBlob: Blob | null;
    isGenerating: boolean;
    setTheme: (theme: ThemeName) => void;
    setAvatarType: (type: AvatarType) => void;
    setAvatarStyle: (style: AvatarStyle) => void;
    setCustomMessage: (msg: string) => void;
    setGeneratedBlob: (blob: Blob | null) => void;
    setIsGenerating: (generating: boolean) => void;
}

// Helper to sync preferences to server
async function syncPrefs(partial: Record<string, string>) {
    try {
        const stored = JSON.parse(localStorage.getItem('learnwall-wallpaper') || '{}');
        const state = stored?.state || {};
        // Get uid from userStore
        const userStored = JSON.parse(localStorage.getItem('learnwall-user') || '{}');
        const uid = userStored?.state?.uid || 'default';

        if (!uid || uid === 'default') return;

        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        const theme = partial.theme !== undefined ? partial.theme : (state.theme || 'dark');
        const avatarType = partial.avatarType !== undefined ? partial.avatarType : (state.avatarType || 'boy');
        const avatarStyle = partial.avatarStyle !== undefined ? partial.avatarStyle : (state.avatarStyle || 'casual');
        const customMessage = partial.customMessage !== undefined ? partial.customMessage : (state.customMessage || '');

        await supabase.from('preferences').upsert({
            user_id: uid,
            theme,
            avatar_type: avatarType,
            avatar_style: avatarStyle,
            custom_message: customMessage
        });
    } catch (e) {
        console.error('Failed to sync preferences direct to Supabase:', e);
    }
}

export const useWallpaperStore = create<WallpaperState>()(
    persist(
        (set) => ({
            theme: 'dark',
            avatarType: 'boy',
            avatarStyle: 'casual',
            customMessage: '',
            generatedBlob: null,
            isGenerating: false,
            setTheme: (theme) => { set({ theme }); syncPrefs({ theme }); },
            setAvatarType: (type) => { set({ avatarType: type }); syncPrefs({ avatarType: type }); },
            setAvatarStyle: (style) => { set({ avatarStyle: style }); syncPrefs({ avatarStyle: style }); },
            setCustomMessage: (msg) => set({ customMessage: msg }),
            setGeneratedBlob: (blob) => set({ generatedBlob: blob }),
            setIsGenerating: (generating) => set({ isGenerating: generating }),
        }),
        {
            name: 'learnwall-wallpaper',
            partialize: (state) => ({
                theme: state.theme,
                avatarType: state.avatarType,
                avatarStyle: state.avatarStyle,
                customMessage: state.customMessage,
            }),
        }
    )
);
