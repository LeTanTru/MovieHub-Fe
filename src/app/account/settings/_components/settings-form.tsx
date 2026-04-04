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
import { useAuth } from '@/hooks';
import { logger } from '@/logger';
import { useUpdateSettingsMutation } from '@/queries';
import { settingsSchema } from '@/schemaValidations';
import { SettingBodyType } from '@/types';
import { notify } from '@/utils';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function SettingsForm() {
  const { profile } = useAuth();

  const settings = JSON.parse(profile?.settings || '{}');

  const { mutateAsync: updateSettingMutate, isPending } =
    useUpdateSettingsMutation();

  const defaultValues: SettingBodyType = {
    audio: 100,
    autoNextEpisode: true,
    autoSkipIntro: true,
    brightness: 100,
    playbackSpeed: 1,
    resolution: 0 // Auto
  };

  const playbackSpeedMin = 0.25;
  const playbackSpeedMax = 2;
  const playbackSpeedStep = 0.05;

  const initialValues: SettingBodyType = useMemo(
    () => ({
      audio: settings.audio || 100,
      autoNextEpisode: settings.autoNextEpisode || true,
      autoSkipIntro: settings.autoSkipIntro || true,
      brightness: settings.brightness || 100,
      playbackSpeed: settings.playbackSpeed || 1,
      resolution: settings.resolution || 0
    }),
    [
      settings.audio,
      settings.autoNextEpisode,
      settings.autoSkipIntro,
      settings.brightness,
      settings.playbackSpeed,
      settings.resolution
    ]
  );

  const onSubmit = async (
    values: SettingBodyType,
    form: UseFormReturn<SettingBodyType>
  ) => {
    await updateSettingMutate(values, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Cập nhật cài đặt thành công');
          form.reset(values);
        }
      },
      onError: (error) => {
        logger.error('Error while updating settings', error);
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
        {(form) => (
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
                  min={playbackSpeedMin}
                  max={playbackSpeedMax}
                  step={playbackSpeedStep}
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
                  options={[
                    { value: 0, label: 'Tự động' },
                    { value: 1, label: '720p' },
                    { value: 2, label: '1080p' },
                    { value: 3, label: '1440p' },
                    { value: 4, label: 'Tối đa' }
                  ]}
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
            <Row className='max-480:mb-0 max-480:flex-col-reverse max-480:gap-6 mb-2 flex justify-end'>
              <Col className='grid-c-4 max-640:grid-c-6 max-480:grid-c-12'>
                <Button
                  variant='outline'
                  disabled={isPending || !form.formState.isDirty}
                >
                  Hủy
                </Button>
              </Col>
              <Col className='grid-c-4 max-640:grid-c-6 max-480:grid-c-12'>
                <Button
                  variant='primary'
                  type='submit'
                  disabled={isPending || !form.formState.isDirty}
                  loading={isPending}
                  className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 dark:disabled:bg-golden-glow/80 dark:disabled:hover:bg-golden-glow/80'
                >
                  Cập nhật
                </Button>
              </Col>
            </Row>
          </>
        )}
      </BaseForm>
    </section>
  );
}
