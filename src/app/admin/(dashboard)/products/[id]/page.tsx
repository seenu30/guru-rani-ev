'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, Package } from 'lucide-react';
import { Card } from '@/components/molecules/Card';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import { Badge } from '@/components/atoms/Badge';
import { Heading, Text } from '@/components/atoms/Typography';
import { createClient } from '@/lib/supabase/client';
import type { ScooterModel, Variant, Color } from '@/types';

interface VariantWithColors extends Variant {
  colors: Color[];
}

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const isNew = productId === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [model, setModel] = useState<Partial<ScooterModel>>({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    image_url: '',
    status: 'draft',
    sort_order: 0,
  });
  const [variants, setVariants] = useState<VariantWithColors[]>([]);

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, [isNew, productId]);

  const fetchProduct = async () => {
    const supabase = createClient();

    const { data: modelData, error: modelError } = await supabase
      .from('scooter_models')
      .select('*')
      .eq('id', productId)
      .single();

    if (modelError || !modelData) {
      router.push('/admin/products');
      return;
    }

    setModel(modelData as ScooterModel);

    // Fetch variants with colors
    const { data: variantsData } = await supabase
      .from('variants')
      .select('*, colors(*)')
      .eq('model_id', productId)
      .order('sort_order', { ascending: true });

    setVariants((variantsData || []) as VariantWithColors[]);
    setIsLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleModelChange = (field: keyof ScooterModel, value: string | number) => {
    setModel((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && !model.id ? { slug: generateSlug(value as string) } : {}),
    }));
  };

  const handleSave = async () => {
    if (!model.name || !model.slug) {
      alert('Please fill in the required fields');
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      if (isNew) {
        const { data, error } = await supabase
          .from('scooter_models')
          .insert({
            name: model.name,
            slug: model.slug,
            tagline: model.tagline || null,
            description: model.description || null,
            image_url: model.image_url || null,
            status: model.status || 'draft',
            sort_order: model.sort_order || 0,
          } as never)
          .select()
          .single();

        if (error) throw error;
        router.push(`/admin/products/${(data as { id: string }).id}`);
      } else {
        const { error } = await supabase
          .from('scooter_models')
          .update({
            name: model.name,
            slug: model.slug,
            tagline: model.tagline,
            description: model.description,
            image_url: model.image_url,
            status: model.status,
            sort_order: model.sort_order,
          } as never)
          .eq('id', productId);

        if (error) throw error;
      }

      // Save variants
      for (const variant of variants) {
        if (variant.id.startsWith('new-')) {
          // Insert new variant
          const { data: newVariant, error: variantError } = await supabase
            .from('variants')
            .insert({
              model_id: productId,
              name: variant.name,
              price: variant.price,
              range_km: variant.range_km,
              top_speed: variant.top_speed,
              battery: variant.battery,
              charging_time: variant.charging_time,
              motor_power: variant.motor_power,
              boot_space: variant.boot_space,
              specs: variant.specs,
              sort_order: variant.sort_order,
              status: variant.status,
            } as never)
            .select()
            .single();

          if (!variantError && newVariant) {
            // Insert colors for this variant
            for (const color of variant.colors) {
              await supabase.from('colors').insert({
                variant_id: (newVariant as { id: string }).id,
                name: color.name,
                hex_code: color.hex_code,
                image_url: color.image_url,
              } as never);
            }
          }
        } else {
          // Update existing variant
          await supabase
            .from('variants')
            .update({
              name: variant.name,
              price: variant.price,
              range_km: variant.range_km,
              top_speed: variant.top_speed,
              battery: variant.battery,
              charging_time: variant.charging_time,
              motor_power: variant.motor_power,
              boot_space: variant.boot_space,
              specs: variant.specs,
              sort_order: variant.sort_order,
              status: variant.status,
            } as never)
            .eq('id', variant.id);
        }
      }

      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }

    setIsSaving(false);
  };

  const addVariant = () => {
    const newVariant: VariantWithColors = {
      id: `new-${Date.now()}`,
      model_id: productId,
      name: '',
      price: 0,
      range_km: 0,
      top_speed: 0,
      battery: '',
      charging_time: '',
      motor_power: '',
      boot_space: null,
      specs: {},
      sort_order: variants.length,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      colors: [],
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: unknown) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const removeVariant = async (index: number) => {
    const variant = variants[index];
    if (!variant.id.startsWith('new-')) {
      const supabase = createClient();
      await supabase.from('variants').delete().eq('id', variant.id);
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addColor = (variantIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].colors.push({
      id: `new-${Date.now()}`,
      variant_id: variants[variantIndex].id,
      name: '',
      hex_code: '#000000',
      image_url: null,
      created_at: new Date().toISOString(),
    });
    setVariants(updated);
  };

  const updateColor = (variantIndex: number, colorIndex: number, field: keyof Color, value: string) => {
    const updated = [...variants];
    updated[variantIndex].colors[colorIndex] = {
      ...updated[variantIndex].colors[colorIndex],
      [field]: value,
    };
    setVariants(updated);
  };

  const removeColor = async (variantIndex: number, colorIndex: number) => {
    const color = variants[variantIndex].colors[colorIndex];
    if (!color.id.startsWith('new-')) {
      const supabase = createClient();
      await supabase.from('colors').delete().eq('id', color.id);
    }
    const updated = [...variants];
    updated[variantIndex].colors = updated[variantIndex].colors.filter((_, i) => i !== colorIndex);
    setVariants(updated);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <Heading level={2}>{isNew ? 'Add Product' : 'Edit Product'}</Heading>
            <Text color="muted">{isNew ? 'Create a new scooter model' : model.name}</Text>
          </div>
        </div>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          <Save size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Model Details */}
      <Card variant="default" className="p-6">
        <h3 className="font-heading font-semibold text-text-primary mb-4">Model Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Name <span className="text-error">*</span>
            </label>
            <Input
              value={model.name || ''}
              onChange={(e) => handleModelChange('name', e.target.value)}
              placeholder="e.g., Guru Rani X"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Slug <span className="text-error">*</span>
            </label>
            <Input
              value={model.slug || ''}
              onChange={(e) => handleModelChange('slug', e.target.value)}
              placeholder="e.g., guru-rani-x"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tagline</label>
            <Input
              value={model.tagline || ''}
              onChange={(e) => handleModelChange('tagline', e.target.value)}
              placeholder="e.g., The Ultimate Urban Commuter"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
            <Select
              value={model.status || 'draft'}
              onChange={(e) => handleModelChange('status', e.target.value)}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'active', label: 'Active' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <Textarea
              value={model.description || ''}
              onChange={(e) => handleModelChange('description', e.target.value)}
              placeholder="Describe this scooter model..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Image URL</label>
            <Input
              value={model.image_url || ''}
              onChange={(e) => handleModelChange('image_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Sort Order</label>
            <Input
              type="number"
              value={model.sort_order || 0}
              onChange={(e) => handleModelChange('sort_order', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </Card>

      {/* Variants */}
      {!isNew && (
        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-text-primary">Variants</h3>
            <Button variant="outline" size="sm" onClick={addVariant}>
              <Plus size={16} className="mr-1" />
              Add Variant
            </Button>
          </div>

          {variants.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <Package size={40} className="mx-auto mb-2 opacity-50" />
              <p>No variants yet. Add your first variant.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {variants.map((variant, variantIndex) => (
                <div key={variant.id} className="border border-surface rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">Variant {variantIndex + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(variantIndex)}
                      className="text-error hover:bg-error/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                      <Input
                        value={variant.name}
                        onChange={(e) => updateVariant(variantIndex, 'name', e.target.value)}
                        placeholder="e.g., Standard, Pro, Max"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Price (paise)</label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(variantIndex, 'price', parseInt(e.target.value) || 0)}
                        placeholder="e.g., 9999900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Range (km)</label>
                      <Input
                        type="number"
                        value={variant.range_km}
                        onChange={(e) => updateVariant(variantIndex, 'range_km', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Top Speed (km/h)</label>
                      <Input
                        type="number"
                        value={variant.top_speed}
                        onChange={(e) => updateVariant(variantIndex, 'top_speed', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Battery</label>
                      <Input
                        value={variant.battery}
                        onChange={(e) => updateVariant(variantIndex, 'battery', e.target.value)}
                        placeholder="e.g., 3.7 kWh"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Charging Time</label>
                      <Input
                        value={variant.charging_time}
                        onChange={(e) => updateVariant(variantIndex, 'charging_time', e.target.value)}
                        placeholder="e.g., 4 hours"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Motor Power</label>
                      <Input
                        value={variant.motor_power}
                        onChange={(e) => updateVariant(variantIndex, 'motor_power', e.target.value)}
                        placeholder="e.g., 4.5 kW"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Boot Space (L)</label>
                      <Input
                        type="number"
                        value={variant.boot_space || ''}
                        onChange={(e) => updateVariant(variantIndex, 'boot_space', parseInt(e.target.value) || null)}
                      />
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="border-t border-surface pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-text-secondary">Colors</span>
                      <Button variant="ghost" size="sm" onClick={() => addColor(variantIndex)}>
                        <Plus size={14} className="mr-1" />
                        Add Color
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {variant.colors.map((color, colorIndex) => (
                        <div
                          key={color.id}
                          className="flex items-center gap-2 p-2 bg-surface/50 rounded-lg"
                        >
                          <input
                            type="color"
                            value={color.hex_code}
                            onChange={(e) => updateColor(variantIndex, colorIndex, 'hex_code', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <Input
                            value={color.name}
                            onChange={(e) => updateColor(variantIndex, colorIndex, 'name', e.target.value)}
                            placeholder="Color name"
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColor(variantIndex, colorIndex)}
                            className="text-error hover:bg-error/10 p-1"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                      {variant.colors.length === 0 && (
                        <span className="text-sm text-text-muted">No colors added</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {isNew && (
        <Card variant="default" className="p-6">
          <div className="text-center py-4 text-text-muted">
            <p>Save the product first, then you can add variants and colors.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
