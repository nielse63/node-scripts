import { defaults, FileObject, GenerateTests, Options } from './GenerateTests';

export default async (
  options: Options | string = { ...defaults }
): Promise<FileObject[]> => {
  const generateTests = new GenerateTests(options);
  const output = await generateTests.run();
  return output;
};
