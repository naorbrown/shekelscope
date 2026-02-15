'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Trash2, UserCircle } from 'lucide-react';

export function ProfileManager() {
  const t = useTranslations('profiles');
  const locale = useLocale();
  const [showNameInput, setShowNameInput] = useState(false);
  const [profileName, setProfileName] = useState('');

  const {
    profiles,
    activeProfileId,
    loadProfile,
    saveProfile,
    deleteProfile,
    hasCalculated,
  } = useCalculatorStore();

  const isHe = locale === 'he';
  const maxReached = profiles.length >= 5;

  function handleSave() {
    if (!profileName.trim()) return;
    saveProfile(profileName.trim());
    setProfileName('');
    setShowNameInput(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setShowNameInput(false);
  }

  if (!hasCalculated && profiles.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />

      {profiles.length > 0 && (
        <Select
          value={activeProfileId ?? 'current'}
          onValueChange={(val) => {
            if (val !== 'current') loadProfile(val);
          }}
        >
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder={t('title')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">
              {isHe ? 'נוכחי' : 'Current'}
            </SelectItem>
            {profiles.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {activeProfileId && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => deleteProfile(activeProfileId)}
          title={t('delete')}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      )}

      {hasCalculated && !showNameInput && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setShowNameInput(true)}
          disabled={maxReached}
        >
          <Save className="h-3.5 w-3.5" />
          {t('save')}
        </Button>
      )}

      {showNameInput && (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('profileName')}
            className="h-8 w-[140px] rounded-md border border-input bg-background px-2 text-sm"
            autoFocus
          />
          <Button
            variant="default"
            size="sm"
            className="h-8 text-xs"
            onClick={handleSave}
            disabled={!profileName.trim()}
          >
            {t('save')}
          </Button>
        </div>
      )}

      {maxReached && !showNameInput && (
        <span className="text-xs text-muted-foreground">
          {t('maxReached')}
        </span>
      )}
    </div>
  );
}
