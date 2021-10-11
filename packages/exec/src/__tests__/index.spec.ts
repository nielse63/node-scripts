import exec from '..';

const input = 'howdy!';

describe('exec', () => {
  it('should return expected value', async () => {
    const output = await exec(`echo "${input}"`);
    expect(output).toEqual(input);
  });

  it('should trim output', async () => {
    const output = await exec(`echo "       ${input}           "`);
    expect(output).toEqual(input);
  });

  it('should reject on error', async () => {
    await expect(exec('exit 1')).toReject();
  });
});
