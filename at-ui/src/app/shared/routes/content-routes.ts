import { Routes } from '@angular/router';

export const content: Routes = [
    {
      path: 'tong-quan',
      loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
    },
    {
      path: 'tiep-nhan',
      loadChildren: () => import('../../components/receive/receive.module').then(m => m.ReceiveModule)
    },
    {
      path: 'kham-benh',
      loadChildren: () => import('../../components/examine/examine.mudule').then(m => m.ExamineModule),
    },
    {
      path: 'lich-hen',
      loadChildren: () => import('../../components/appointment-schedule/appointment-schedule.module').then(m => m.AppointmentScheduleModule),
    },
    {
      path: 'nhan-vien',
      loadChildren: () => import('../../components/staffs/staffs.module').then(m => m.StaffsModule),
    },
    {
      path: 'quan-ly-ghe',
      loadChildren: () => import('../../components/chair-setting/chair-setting.module').then(m => m.ChairSettingModule),
    },
    {
      path: 'cai-dat',
      loadChildren: () => import('../../components/settings/settings.module').then(m => m.SettingsModule),
    },
    {
      path: 'bao-cao',
      loadChildren: () => import('../../components/report/report.module').then(m => m.ReportModule),
    },
    {
      path: 'ton-kho',
      loadChildren: () => import('../../components/inventory-manager/inventory-manager.module').then(m => m.InventoryManagerModule),
    },
    {
      path: 'benh-an',
      loadChildren: () => import('../../components/medicalrecord/medicalrecord.module').then(m => m.MedicalrecordModule),
    },
    {
      path: 'ho-so',
      loadChildren: () => import('../../components/auth/auth-routing.module').then(m => m.AuthRoutingModule),
    },
];
