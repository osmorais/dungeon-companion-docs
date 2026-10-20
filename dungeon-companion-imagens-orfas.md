# Dungeon Companion — Imagens órfãs no Supabase Storage (para exclusão manual)

Levantado em 2026-10-14, **só leitura** (nada foi apagado). Ver `dungeon-companion-lgpd.md`, item 6.

- Bucket: `monster-images` — 46 arquivos no total, 8 em uso, **38 órfãos (61.0 MB)**.
- "Órfão" = o arquivo não aparece em nenhum `image_url` de `character`, `monster_catalog` ou
  `monster_session`. São sobras de imagens trocadas/excluídas antes da limpeza automática existir
  e continuam acessíveis por quem tiver o link público.
- **Antes de apagar**, confira que nenhuma imagem nova foi enviada usando um desses arquivos
  (a lista é uma foto do momento do levantamento). Arquivos criados **depois** de 2026-10-14 não
  estão aqui.
- Como apagar no painel: Supabase → Storage → bucket `monster-images` → selecionar os arquivos
  pelo nome → Delete.

| # | Arquivo | Tamanho | Enviado em (UTC) | Link público |
|---|---|---|---|---|
| 1 | `78e700ab-3671-44d8-a9a3-130d7da28f91-638742157685478339.png` | 615 KB | 2026-09-10 02:45:50 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/78e700ab-3671-44d8-a9a3-130d7da28f91-638742157685478339.png) |
| 2 | `d19cafbb-2c6e-4172-8821-7355edfb75ed-IMG_9515.jpeg` | 2.03 MB | 2026-09-10 02:47:26 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/d19cafbb-2c6e-4172-8821-7355edfb75ed-IMG_9515.jpeg) |
| 3 | `b9c8d314-f61e-4771-be8d-61c43dcb5d2b-IMG_9524.jpeg` | 2.80 MB | 2026-09-10 02:49:02 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/b9c8d314-f61e-4771-be8d-61c43dcb5d2b-IMG_9524.jpeg) |
| 4 | `e4f6cde0-5eb1-4a02-8bf6-399359d56525-IMG_9515.jpeg` | 2.03 MB | 2026-09-10 02:52:48 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/e4f6cde0-5eb1-4a02-8bf6-399359d56525-IMG_9515.jpeg) |
| 5 | `27d1ca58-9404-4ffb-85ff-f1f2ad4ce633-IMG_9515.jpeg` | 2.03 MB | 2026-09-12 21:11:06 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/27d1ca58-9404-4ffb-85ff-f1f2ad4ce633-IMG_9515.jpeg) |
| 6 | `696c9b90-43c6-4d0a-96ee-b4be06e89200-d9e56f0c1d854bba47cccb540f9ce73e.jpg` | 27 KB | 2026-09-13 02:34:29 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/696c9b90-43c6-4d0a-96ee-b4be06e89200-d9e56f0c1d854bba47cccb540f9ce73e.jpg) |
| 7 | `63d21874-0141-43ec-bbd2-6873b500b749-60cc4-skeleton_orc__eric_quigley.jpg` | 312 KB | 2026-09-13 03:23:29 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/63d21874-0141-43ec-bbd2-6873b500b749-60cc4-skeleton_orc__eric_quigley.jpg) |
| 8 | `7e734359-8872-4513-bfc9-8d577ab6ab50-skeleton_warrior_by_montjart_dcpv61s-fullview.jpg` | 67 KB | 2026-09-13 03:23:44 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/7e734359-8872-4513-bfc9-8d577ab6ab50-skeleton_warrior_by_montjart_dcpv61s-fullview.jpg) |
| 9 | `1c3cbe5a-67ac-4788-8f9a-f1f61da7f70d-ad5d6d054fca510611123cbc27f37b60.jpg` | 73 KB | 2026-09-13 03:23:53 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/1c3cbe5a-67ac-4788-8f9a-f1f61da7f70d-ad5d6d054fca510611123cbc27f37b60.jpg) |
| 10 | `8bdea018-8945-4f02-8780-3b692a8f06d3-b0de700db738750c2841dcdd5d196fc3.jpg` | 45 KB | 2026-09-13 03:24:08 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/8bdea018-8945-4f02-8780-3b692a8f06d3-b0de700db738750c2841dcdd5d196fc3.jpg) |
| 11 | `48deb9f0-d2e0-41fa-bd31-974ad8aecf0e-skeleton_warrior_by_montjart_dcpv61s-fullview.jpg` | 67 KB | 2026-09-13 03:24:23 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/48deb9f0-d2e0-41fa-bd31-974ad8aecf0e-skeleton_warrior_by_montjart_dcpv61s-fullview.jpg) |
| 12 | `d34357c4-087c-42c3-afc1-f51f2c2ba02d-f1cbdd8e2141e5de26f2e2cac0faac28.jpg` | 89 KB | 2026-09-13 03:24:32 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/d34357c4-087c-42c3-afc1-f51f2c2ba02d-f1cbdd8e2141e5de26f2e2cac0faac28.jpg) |
| 13 | `225ae931-c125-43e1-85f6-00c7f1b8d75f-image.jpg` | 2.58 MB | 2026-09-13 04:19:49 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/225ae931-c125-43e1-85f6-00c7f1b8d75f-image.jpg) |
| 14 | `9204889c-d4cd-4e65-9427-6eea6f915e98-Screenshot_20260913-012141_Gallery.jpg` | 297 KB | 2026-09-13 04:22:29 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/9204889c-d4cd-4e65-9427-6eea6f915e98-Screenshot_20260913-012141_Gallery.jpg) |
| 15 | `547ea3fd-1a14-4e73-9832-a6d234fc5e40-Screenshot_20260913-014055_Gallery.jpg` | 277 KB | 2026-09-13 04:41:33 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/547ea3fd-1a14-4e73-9832-a6d234fc5e40-Screenshot_20260913-014055_Gallery.jpg) |
| 16 | `7486adf9-8f6a-4b4c-82f1-790f9784673b-ChatGPT Image 19 de set. de 2026, 06_41_58.png` | 2.50 MB | 2026-09-19 09:50:19 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/7486adf9-8f6a-4b4c-82f1-790f9784673b-ChatGPT%20Image%2019%20de%20set.%20de%202026,%2006_41_58.png) |
| 17 | `1f409d08-7aba-4c21-b519-ad7c8ad685da-image.jpg` | 1.47 MB | 2026-09-20 01:40:46 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/1f409d08-7aba-4c21-b519-ad7c8ad685da-image.jpg) |
| 18 | `bc36586f-3f5e-46c0-acf3-ea916d54770f-A90F9E48-ADCC-4A75-9921-6F84B3F031BD.png` | 2.24 MB | 2026-09-20 01:44:51 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/bc36586f-3f5e-46c0-acf3-ea916d54770f-A90F9E48-ADCC-4A75-9921-6F84B3F031BD.png) |
| 19 | `4760e9d9-d0bd-4518-94d8-3038fc3adcd2-image.jpg` | 1.34 MB | 2026-09-20 04:20:43 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/4760e9d9-d0bd-4518-94d8-3038fc3adcd2-image.jpg) |
| 20 | `dc685095-080f-425b-a4a6-a784819c2ae8-A90F9E48-ADCC-4A75-9921-6F84B3F031BD.png` | 2.24 MB | 2026-09-20 04:22:21 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/dc685095-080f-425b-a4a6-a784819c2ae8-A90F9E48-ADCC-4A75-9921-6F84B3F031BD.png) |
| 21 | `1db8a0fd-558d-4b71-8282-f56b673debb2-1000385876.jpg` | 74 KB | 2026-09-20 04:28:05 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/1db8a0fd-558d-4b71-8282-f56b673debb2-1000385876.jpg) |
| 22 | `4a68a596-e024-453d-887b-224d737bb78d-1000385287.jpg` | 255 KB | 2026-09-20 04:29:06 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/4a68a596-e024-453d-887b-224d737bb78d-1000385287.jpg) |
| 23 | `983208cb-e1ac-446c-9ecf-d80e45ac5db8-1000338609.jpg` | 123 KB | 2026-09-20 04:42:22 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/983208cb-e1ac-446c-9ecf-d80e45ac5db8-1000338609.jpg) |
| 24 | `91614f35-4d1d-41d8-8781-ae426281bb98-733A79BD-45DF-4D7F-B005-82EE24F4D972.png` | 2.52 MB | 2026-09-20 04:50:13 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/91614f35-4d1d-41d8-8781-ae426281bb98-733A79BD-45DF-4D7F-B005-82EE24F4D972.png) |
| 25 | `a2c6a1e9-2774-48ee-bea8-dca94875be0a-20260920_024554.jpg` | 9.43 MB | 2026-09-20 05:46:53 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/a2c6a1e9-2774-48ee-bea8-dca94875be0a-20260920_024554.jpg) |
| 26 | `79768cc1-fd21-4780-bdb4-05b790238acf-CAB2DEED-449F-43A7-96CF-6B3BCE015D72.png` | 2.36 MB | 2026-09-20 05:49:02 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/79768cc1-fd21-4780-bdb4-05b790238acf-CAB2DEED-449F-43A7-96CF-6B3BCE015D72.png) |
| 27 | `a187a5a1-3efb-4aed-b91b-0aae7d734648-20260920_024554.jpg` | 9.43 MB | 2026-09-20 05:50:46 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/a187a5a1-3efb-4aed-b91b-0aae7d734648-20260920_024554.jpg) |
| 28 | `4f1c4f6b-9607-49b6-9bf5-6075d08fc35f-95492174-9E76-42B8-87ED-F985707F3CF9.jpeg` | 1.80 MB | 2026-09-27 03:47:35 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/4f1c4f6b-9607-49b6-9bf5-6075d08fc35f-95492174-9E76-42B8-87ED-F985707F3CF9.jpeg) |
| 29 | `3b6267f3-9f7b-4ccc-865a-2182d9ab8bba-IMG_1265.jpeg` | 4.33 MB | 2026-09-27 03:49:02 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/3b6267f3-9f7b-4ccc-865a-2182d9ab8bba-IMG_1265.jpeg) |
| 30 | `a6877282-d045-4385-8048-5cb58fc6d64f-IMG_2936.png` | 1.97 MB | 2026-10-03 20:32:23 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/a6877282-d045-4385-8048-5cb58fc6d64f-IMG_2936.png) |
| 31 | `17cf2657-16b2-4082-b3f2-757952bf976e-IMG_2938.png` | 2.59 MB | 2026-10-03 20:32:54 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/17cf2657-16b2-4082-b3f2-757952bf976e-IMG_2938.png) |
| 32 | `42eb79d2-1026-4dd8-a63c-a7e7d5f167b2-IMG_2500.jpeg` | 999 KB | 2026-10-03 20:34:01 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/42eb79d2-1026-4dd8-a63c-a7e7d5f167b2-IMG_2500.jpeg) |
| 33 | `f8668ed4-99fb-42a7-a673-82bdc5f94255-IMG_2954.jpeg` | 378 KB | 2026-10-03 20:39:32 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/f8668ed4-99fb-42a7-a673-82bdc5f94255-IMG_2954.jpeg) |
| 34 | `765f0251-c431-4a4b-b0b1-65a18280ea85-IMG_2955.jpeg` | 365 KB | 2026-10-03 20:41:21 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/765f0251-c431-4a4b-b0b1-65a18280ea85-IMG_2955.jpeg) |
| 35 | `d2e53230-9431-4079-8499-4db06af73d40-IMG_2954.jpeg` | 378 KB | 2026-10-03 20:42:33 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/d2e53230-9431-4079-8499-4db06af73d40-IMG_2954.jpeg) |
| 36 | `f699b510-ccd2-4c26-9412-8f4b5316aea1-IMG_2955.jpeg` | 365 KB | 2026-10-03 20:43:05 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/f699b510-ccd2-4c26-9412-8f4b5316aea1-IMG_2955.jpeg) |
| 37 | `545b02fa-2b99-47cd-9289-09e3c8b07b82-IMG_2957.jpeg` | 327 KB | 2026-10-03 20:44:06 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/545b02fa-2b99-47cd-9289-09e3c8b07b82-IMG_2957.jpeg) |
| 38 | `b9a30435-2652-4db7-9af5-593e72be8aa5-1000388817.jpg` | 356 KB | 2026-10-03 21:25:12 | [abrir](https://bkocithhkkedtdkdezkx.supabase.co/storage/v1/object/public/monster-images/b9a30435-2652-4db7-9af5-593e72be8aa5-1000388817.jpg) |

## Nomes, um por linha (pra copiar)

```
78e700ab-3671-44d8-a9a3-130d7da28f91-638742157685478339.png
d19cafbb-2c6e-4172-8821-7355edfb75ed-IMG_9515.jpeg
b9c8d314-f61e-4771-be8d-61c43dcb5d2b-IMG_9524.jpeg
e4f6cde0-5eb1-4a02-8bf6-399359d56525-IMG_9515.jpeg
27d1ca58-9404-4ffb-85ff-f1f2ad4ce633-IMG_9515.jpeg
696c9b90-43c6-4d0a-96ee-b4be06e89200-d9e56f0c1d854bba47cccb540f9ce73e.jpg
63d21874-0141-43ec-bbd2-6873b500b749-60cc4-skeleton_orc__eric_quigley.jpg
7e734359-8872-4513-bfc9-8d577ab6ab50-skeleton_warrior_by_montjart_dcpv61s-fullview.jpg
1c3cbe5a-67ac-4788-8f9a-f1f61da7f70d-ad5d6d054fca510611123cbc27f37b60.jpg
8bdea018-8945-4f02-8780-3b692a8f06d3-b0de700db738750c2841dcdd5d196fc3.jpg
48deb9f0-d2e0-41fa-bd31-974ad8aecf0e-skeleton_warrior_by_montjart_dcpv61s-fullview.jpg
d34357c4-087c-42c3-afc1-f51f2c2ba02d-f1cbdd8e2141e5de26f2e2cac0faac28.jpg
225ae931-c125-43e1-85f6-00c7f1b8d75f-image.jpg
9204889c-d4cd-4e65-9427-6eea6f915e98-Screenshot_20260913-012141_Gallery.jpg
547ea3fd-1a14-4e73-9832-a6d234fc5e40-Screenshot_20260913-014055_Gallery.jpg
7486adf9-8f6a-4b4c-82f1-790f9784673b-ChatGPT Image 19 de set. de 2026, 06_41_58.png
1f409d08-7aba-4c21-b519-ad7c8ad685da-image.jpg
bc36586f-3f5e-46c0-acf3-ea916d54770f-A90F9E48-ADCC-4A75-9921-6F84B3F031BD.png
4760e9d9-d0bd-4518-94d8-3038fc3adcd2-image.jpg
dc685095-080f-425b-a4a6-a784819c2ae8-A90F9E48-ADCC-4A75-9921-6F84B3F031BD.png
1db8a0fd-558d-4b71-8282-f56b673debb2-1000385876.jpg
4a68a596-e024-453d-887b-224d737bb78d-1000385287.jpg
983208cb-e1ac-446c-9ecf-d80e45ac5db8-1000338609.jpg
91614f35-4d1d-41d8-8781-ae426281bb98-733A79BD-45DF-4D7F-B005-82EE24F4D972.png
a2c6a1e9-2774-48ee-bea8-dca94875be0a-20260920_024554.jpg
79768cc1-fd21-4780-bdb4-05b790238acf-CAB2DEED-449F-43A7-96CF-6B3BCE015D72.png
a187a5a1-3efb-4aed-b91b-0aae7d734648-20260920_024554.jpg
4f1c4f6b-9607-49b6-9bf5-6075d08fc35f-95492174-9E76-42B8-87ED-F985707F3CF9.jpeg
3b6267f3-9f7b-4ccc-865a-2182d9ab8bba-IMG_1265.jpeg
a6877282-d045-4385-8048-5cb58fc6d64f-IMG_2936.png
17cf2657-16b2-4082-b3f2-757952bf976e-IMG_2938.png
42eb79d2-1026-4dd8-a63c-a7e7d5f167b2-IMG_2500.jpeg
f8668ed4-99fb-42a7-a673-82bdc5f94255-IMG_2954.jpeg
765f0251-c431-4a4b-b0b1-65a18280ea85-IMG_2955.jpeg
d2e53230-9431-4079-8499-4db06af73d40-IMG_2954.jpeg
f699b510-ccd2-4c26-9412-8f4b5316aea1-IMG_2955.jpeg
545b02fa-2b99-47cd-9289-09e3c8b07b82-IMG_2957.jpeg
b9a30435-2652-4db7-9af5-593e72be8aa5-1000388817.jpg
```
