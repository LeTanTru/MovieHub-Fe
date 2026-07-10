'use client';

import {
  BooleanField,
  Button,
  Col,
  Row,
  SelectField,
  SliderField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import {
  qualityOptions,
  queryKeys,
  SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
  subtitleBackgroundColors,
  subtitleFontSizes,
  subtitleTextColors
} from '@/constants';
import { useAuth } from '@/hooks';
import { logger } from '@/logger';
import { useUpdateSettingsMutation } from '@/queries';
import { settingsSchema } from '@/schemaValidations';
import type { OptionType, SettingBodyType, SettingResType } from '@/types';
import { invalidateQueries, notify } from '@/utils';
import { useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ConfirmModal } from '@/components/modal';

const getSubtitleFontSizeLabel = (option: OptionType) =>
  `${option.label} (${option.pixels}px)`;

const getColor = (option: OptionType) => String(option.color || '#FFFFFF');

const renderColorSwatch = (option: OptionType) => (
  <span
    aria-hidden='true'
    className='size-4 shrink-0 rounded-full border border-white/30'
    style={{ backgroundColor: getColor(option) }}
  />
);

const renderColorOption = (option: OptionType) => (
  <div className='flex min-w-0 items-center gap-2'>
    {renderColorSwatch(option)}
    <span className='truncate'>{option.label}</span>
  </div>
);

const PLAYBACK_SPEED_MIN = 0.25;
const PLAYBACK_SPEED_MAX = 2;
const PLAYBACK_SPEED_STEP = 0.05;

const defaultValues: SettingBodyType = {
  audio: 100, // max
  autoNextEpisode: true,
  autoSkipIntro: true,
  brightness: 100, // max
  playbackSpeed: 1,
  resolution: 0, // Auto
  subtitleBackgroundColor: SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
  subtitleEnabled: true,
  subtitleFontSize: 0,
  subtitleTextColor: 0
};

export function SettingsForm() {
  const { profile } = useAuth();

  const settings = useMemo<Partial<SettingResType>>(
    () => JSON.parse(profile?.settings || '{}'),
    [profile?.settings]
  );

  const { mutate: updateSetting, isPending } = useUpdateSettingsMutation();

  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const initialValues: SettingBodyType = useMemo(
    () => ({
      audio: settings.audio ?? defaultValues.audio,
      autoNextEpisode:
        settings.autoNextEpisode ?? defaultValues.autoNextEpisode,
      autoSkipIntro: settings.autoSkipIntro ?? defaultValues.autoSkipIntro,
      brightness: settings.brightness ?? defaultValues.brightness,
      playbackSpeed: settings.playbackSpeed ?? defaultValues.playbackSpeed,
      resolution: settings.resolution ?? defaultValues.resolution,
      subtitleBackgroundColor:
        settings.subtitleBackgroundColor ??
        defaultValues.subtitleBackgroundColor,
      subtitleEnabled:
        settings.subtitleEnabled ?? defaultValues.subtitleEnabled,
      subtitleFontSize:
        settings.subtitleFontSize ?? defaultValues.subtitleFontSize,
      subtitleTextColor:
        settings.subtitleTextColor ?? defaultValues.subtitleTextColor
    }),
    [
      settings.audio,
      settings.autoNextEpisode,
      settings.autoSkipIntro,
      settings.brightness,
      settings.playbackSpeed,
      settings.resolution,
      settings.subtitleBackgroundColor,
      settings.subtitleEnabled,
      settings.subtitleFontSize,
      settings.subtitleTextColor
    ]
  );

  const onSubmit = (
    values: SettingBodyType,
    form: UseFormReturn<SettingBodyType>
  ) => {
    updateSetting(values, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Cập nhật cài đặt thành công');
          form.reset(values);
          invalidateQueries([queryKeys.PROFILE]);
        } else {
          notify.error('Cập nhật cài đặt thất bại');
        }
      },
      onError: (error) => {
        logger.error('[UPDATE_SETTINGS_ERROR]', error);
        notify.error('Cập nhật cài đặt thất bại');
      }
    });
  };

  return (
    <section className='bg-vintage-blue max-520:px-4 rounded-lg p-4'>
      <h3 className='text-center text-xl font-semibold'>Cài đặt</h3>
      <p className='text-muted-foreground mt-2 text-center'>
        Cập nhật cài đặt tài khoản
      </p>
      <BaseForm
        defaultValues={defaultValues}
        initialValues={initialValues}
        schema={settingsSchema}
        onSubmit={onSubmit}
        className='bg-transparent p-0'
      >
        {(form) => {
          const subtitleEnabled = form.watch('subtitleEnabled');

          return (
            <>
              <Row>
                <Col className='grid-c-12'>
                  <SliderField
                    label='Âm lượng'
                    control={form.control}
                    name='audio'
                    required
                    unit='%'
                  />
                </Col>
              </Row>
              <Row>
                <Col className='grid-c-12'>
                  <SliderField
                    label='Độ sáng'
                    control={form.control}
                    name='brightness'
                    required
                    unit='%'
                  />
                </Col>
              </Row>
              <Row>
                <Col className='grid-c-12'>
                  <SliderField
                    label='Tốc độ phát'
                    control={form.control}
                    name='playbackSpeed'
                    required
                    unit='x'
                    min={PLAYBACK_SPEED_MIN}
                    max={PLAYBACK_SPEED_MAX}
                    step={PLAYBACK_SPEED_STEP}
                  />
                </Col>
              </Row>
              <Row>
                <Col className='grid-c-12'>
                  <SelectField
                    control={form.control}
                    name='resolution'
                    required
                    label='Độ phân giải'
                    options={qualityOptions}
                  />
                </Col>
              </Row>
              <Row className='max-990:gap-6'>
                <Col className='grid-c-6 max-990:grid-c-12'>
                  <BooleanField
                    control={form.control}
                    name='subtitleEnabled'
                    label='Bật phụ đề'
                    className='data-[state=checked]:bg-zinc-600'
                    checkClassName='peer-data-[state=checked]:text-golden-glow'
                    thumbClassName='dark:data-[state=checked]:bg-golden-glow'
                    required
                  />
                </Col>
              </Row>
              <Row className='max-990:gap-6'>
                <Col className='grid-c-4 max-990:grid-c-12'>
                  <SelectField
                    control={form.control}
                    name='subtitleFontSize'
                    required
                    label='Cỡ chữ phụ đề'
                    placeholder='Chọn cỡ chữ'
                    options={subtitleFontSizes}
                    getLabel={getSubtitleFontSizeLabel}
                    disabled={!subtitleEnabled}
                  />
                </Col>
                <Col className='grid-c-4 max-990:grid-c-12'>
                  <SelectField
                    control={form.control}
                    name='subtitleTextColor'
                    required
                    label='Màu chữ phụ đề'
                    placeholder='Chọn màu chữ'
                    options={subtitleTextColors}
                    getPrefix={renderColorSwatch}
                    renderOption={renderColorOption}
                    disabled={!subtitleEnabled}
                  />
                </Col>
                <Col className='grid-c-4 max-990:grid-c-12'>
                  <SelectField
                    control={form.control}
                    name='subtitleBackgroundColor'
                    required
                    label='Màu nền phụ đề'
                    placeholder='Chọn màu nền'
                    options={subtitleBackgroundColors}
                    getPrefix={renderColorSwatch}
                    renderOption={renderColorOption}
                    disabled={!subtitleEnabled}
                  />
                </Col>
              </Row>
              <Row className='max-990:gap-6'>
                <Col className='grid-c-6 max-990:grid-c-12'>
                  <BooleanField
                    control={form.control}
                    name='autoNextEpisode'
                    label='Tự động phát tập tiếp theo'
                    className='data-[state=checked]:bg-zinc-600'
                    checkClassName='peer-data-[state=checked]:text-golden-glow'
                    thumbClassName='dark:data-[state=checked]:bg-golden-glow'
                    required
                  />
                </Col>
                <Col className='grid-c-6 max-990:grid-c-12'>
                  <BooleanField
                    control={form.control}
                    name='autoSkipIntro'
                    label='Tự động bỏ qua intro'
                    className='data-[state=checked]:bg-zinc-600'
                    checkClassName='peer-data-[state=checked]:text-golden-glow'
                    thumbClassName='dark:data-[state=checked]:bg-golden-glow'
                    required
                  />
                </Col>
              </Row>
              <Row className='max-640:mb-0 max-640:flex-col-reverse max-640:gap-6 mb-2 flex justify-end'>
                <Col className='grid-c-6 max-640:grid-c-12'>
                  <Button
                    variant='outline'
                    type='button'
                    onClick={() => setShowConfirmCancel(true)}
                    disabled={isPending || !form.formState.isDirty}
                    className='w-full border-gray-200 text-white hover:border-gray-200/80 hover:text-white/80 disabled:border-gray-200/80 disabled:text-white/80 disabled:hover:border-gray-200/80 disabled:hover:text-white/80'
                  >
                    Hủy
                  </Button>
                  <ConfirmModal
                    open={showConfirmCancel}
                    onOpenChange={setShowConfirmCancel}
                    message='Bạn có chắc chắn muốn hủy không ?'
                    onConfirm={() => form.reset()}
                  />
                </Col>
                <Col className='grid-c-6 max-640:grid-c-12'>
                  <Button
                    variant='primary'
                    type='submit'
                    disabled={isPending || !form.formState.isDirty}
                    loading={isPending}
                    className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80'
                  >
                    Cập nhật
                  </Button>
                </Col>
              </Row>
            </>
          );
        }}
      </BaseForm>
    </section>
  );
}
