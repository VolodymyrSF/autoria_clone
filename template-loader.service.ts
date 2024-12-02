import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as fse from 'fs-extra';
import * as path from 'path';

@Injectable()
export class TemplateLoaderService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    // Шлях до джерела (src/templates)
    const sourceDir = path.join(process.cwd(), 'src', 'templates');
    // Шлях до місця призначення (dist/templates)
    const destDir = path.join(process.cwd(), 'dist', 'templates');

    if (!fse.existsSync(destDir)) {
      console.log('Templates not found in dist. Copying...');
      try {
        await fse.copy(sourceDir, destDir);
        console.log('Templates copied successfully.');
      } catch (error) {
        console.error('Failed to copy templates:', error.message);
      }
    } else {
      console.log('Templates already exist in dist.');
    }
  }
}
