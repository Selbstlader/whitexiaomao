import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DoubanUserApi } from '#/api/douban/user';

import { z } from '#/adapter/form';
import {
  DOUBAN_USER_STATUS_OPTIONS,
  DoubanUserStatus,
} from '#/types/douban';
import { getRangePickerDefaultProps } from '#/utils';

/** 新增/修改用户的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'username',
      label: '用户名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
        maxlength: 30,
        showCount: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'nickname',
      label: '昵称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入昵称',
        maxlength: 30,
        showCount: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮箱地址',
        maxlength: 50,
      },
      rules: 'required',
    },
    {
      fieldName: 'mobile',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号码',
        maxlength: 11,
      },
      rules: 'required',
    },
    {
      fieldName: 'avatar',
      label: '头像URL',
      component: 'Input',
      componentProps: {
        placeholder: '请输入头像图片URL',
        maxlength: 500,
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注信息',
        rows: 3,
        maxlength: 500,
        showCount: true,
      },
    },
  ];
}

/** 重置密码的表单 */
export function useResetPasswordFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'newPassword',
      label: '新密码',
      component: 'InputPassword',
      componentProps: {
        placeholder: '请输入新密码',
      },
      rules: 'required',
    },
    {
      fieldName: 'confirmPassword',
      label: '确认密码',
      component: 'InputPassword',
      componentProps: {
        placeholder: '请再次输入新密码',
      },
      dependencies: {
        rules(values: Record<string, any>) {
          const { newPassword } = values;
          return z
            .string()
            .nonempty('确认密码不能为空')
            .refine((value) => value === newPassword, '两次输入的密码不一致');
        },
        triggerFields: ['newPassword'],
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'people',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
        allowClear: true,
      },
    },
    {
      fieldName: 'location',
      label: '地区',
      component: 'Input',
      componentProps: {
        placeholder: '请输入地区',
        allowClear: true,
      },
    },
    {
      fieldName: 'introduction',
      label: '个人介绍',
      component: 'Input',
      componentProps: {
        placeholder: '请输入个人介绍关键字',
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns<T = DoubanUserApi.User>(
  onStatusChange?: (
    newStatus: number,
    row: T,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '用户编号',
      width: 80,
    },
    {
      field: 'people',
      title: '用户ID',
      width: 180,
      showOverflow: 'tooltip',
    },
    {
      field: 'location',
      title: '地区',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'introduction',
      title: '个人介绍',
      showOverflow: 'tooltip',
    },
  ];
}