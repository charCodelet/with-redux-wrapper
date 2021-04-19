// source: https://mdn.mozillademos.org/en-US/docs/Mozilla/MathML_Project/MathML_Torture_Test$samples/MathML_Torture_Test?revision=1506691
const examples = [
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4578/=ex1',
    name: 'TeXbook, 16.2-16.3',
    mathML: `<math display="block">
              <mrow>
                <msup>
                  <mi>x</mi>
                  <mn>2</mn>
                </msup>
                <msup>
                  <mi>y</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4579/=ex2',
    name: 'TeXbook, 16.2-16.3',
    mathML: `<math display="block">
              <!--
                  <mrow>
                    <msub><mi></mi><mn>2</mn></msub>
                    <msub><mi>F</mi><mn>3</mn></msub>
                  </mrow>
                  -->
              <mrow>
                <mmultiscripts>
                  <mi>F</mi>
                  <mn>3</mn><none></none>
                  <mprescripts></mprescripts>
                  <mn>2</mn><none></none>
                </mmultiscripts>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4586/=ex21',
    name: 'TeXbook, 17-17.1',
    mathML: `<math display="block">
              <mrow>
                <mfrac>
                  <mrow>
                    <mi>x</mi>
                    <mo>+</mo>
                    <msup>
                      <mi>y</mi>
                      <mn>2</mn>
                    </msup>
                  </mrow>
                  <mrow>
                    <mi>k</mi>
                    <mo>+</mo>
                    <mn>1</mn>
                  </mrow>
                </mfrac>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4587/=ex22',
    name: 'TeXbook, 17-17.1',
    mathML: `<math display="block">
              <mrow>
                <mi>x</mi>
                <mo>+</mo>
                <msup>
                  <mi>y</mi>
                  <mfrac>
                    <mn>2</mn>
                    <mrow>
                      <mi>k</mi>
                      <mo>+</mo>
                      <mn>1</mn>
                    </mrow>
                  </mfrac>
                </msup>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4588/=ex23',
    name: 'TeXbook, 17-17.1',
    mathML: `<math display="block">
              <mrow>
                <mfrac>
                  <mi>a</mi>
                  <mrow>
                    <mi>b</mi>
                    <mo>/</mo>
                    <mn>2</mn>
                  </mrow>
                </mfrac>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4589/=ex24',
    name: 'TeXbook, 17.5-17.6',
    mathML: `<math display="block">
              <mrow>
                <msub>
                  <mi>a</mi>
                  <mn>0</mn>
                </msub>
                <mo>+</mo>
                <mfrac>
                  <mn>1</mn>
                  <mstyle displaystyle="true" scriptlevel="0">
                    <msub>
                      <mi>a</mi>
                      <mn>1</mn>
                    </msub>
                    <mo>+</mo>
                    <mfrac>
                      <mn>1</mn>
                      <mstyle displaystyle="true" scriptlevel="0">
                        <msub>
                          <mi>a</mi>
                          <mn>2</mn>
                        </msub>
                        <mo>+</mo>
                        <mfrac>
                          <mn>1</mn>
                          <mstyle displaystyle="true" scriptlevel="0">
                            <msub>
                              <mi>a</mi>
                              <mn>3</mn>
                            </msub>
                            <mo>+</mo>
                            <mfrac>
                              <mn>1</mn>
                              <mstyle displaystyle="true" scriptlevel="0">
                                <msub>
                                  <mi>a</mi>
                                  <mn>4</mn>
                                </msub>
                              </mstyle>
                            </mfrac>
                          </mstyle>
                        </mfrac>
                      </mstyle>
                    </mfrac>
                  </mstyle>
                </mfrac>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4590/=ex25',
    name: 'TeXbook, 17.5-17.6',
    mathML: `<math>
              <mrow>
                <msub>
                  <mi>a</mi>
                  <mn>0</mn>
                </msub>
                <mo>+</mo>
                <mfrac>
                  <mn>1</mn>
                  <mrow>
                    <msub>
                      <mi>a</mi>
                      <mn>1</mn>
                    </msub>
                    <mo>+</mo>
                    <mfrac>
                      <mn>1</mn>
                      <mrow>
                        <msub>
                          <mi>a</mi>
                          <mn>2</mn>
                        </msub>
                        <mo>+</mo>
                        <mfrac>
                          <mn>1</mn>
                          <mrow>
                            <msub>
                              <mi>a</mi>
                              <mn>3</mn>
                            </msub>
                            <mo>+</mo>
                            <mfrac>
                              <mn>1</mn>
                              <mrow>
                                <msub>
                                  <mi>a</mi>
                                  <mn>4</mn>
                                </msub>
                              </mrow>
                            </mfrac>
                          </mrow>
                        </mfrac>
                      </mrow>
                    </mfrac>
                  </mrow>
                </mfrac>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4591/=ex26',
    name: 'TeXbook, 17.5-17.6',
    mathML: `<math display="block">
              <mrow>
                <mo>(</mo>
                <mfrac linethickness="0px">
                  <mi>n</mi>
                  <mrow>
                    <mi>k</mi>
                    <mo>/</mo>
                    <mn>2</mn>
                  </mrow>
                </mfrac>
                <mo>)</mo>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4592/=ex27',
    name: 'TeXbook, 17.7',
    mathML: `<math display="block">
              <mrow>
                <mrow>
                  <mo>(</mo>
                  <mfrac linethickness="0px">
                    <mi>p</mi>
                    <mn>2</mn>
                  </mfrac>
                  <mo>)</mo>
                </mrow>
                <msup>
                  <mi>x</mi>
                  <mn>2</mn>
                </msup>
                <msup>
                  <mi>y</mi>
                  <mrow>
                    <mi>p</mi>
                    <mo>-</mo>
                    <mn>2</mn>
                  </mrow>
                </msup>
                <mo>-</mo>
                <mfrac>
                  <mn>1</mn>
                  <mrow>
                    <mn>1</mn>
                    <mo>-</mo>
                    <mi>x</mi>
                  </mrow>
                </mfrac>
                <mfrac>
                  <mn>1</mn>
                  <mrow>
                    <mn>1</mn>
                    <mo>-</mo>
                    <msup>
                      <mi>x</mi>
                      <mn>2</mn>
                    </msup>
                  </mrow>
                </mfrac>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4593/=ex29',
    name: 'TeXbook, 17.7-17.8',
    mathML: `<math display="block">
              <mrow>
                <munder>
                  <mo>∑</mo>
                  <mrow>
                    <mfrac linethickness="0px">
                      <mrow>
                        <mn>0</mn>
                        <mo>≤</mo>
                        <mi>i</mi>
                        <mo>≤</mo>
                        <mi>m</mi>
                      </mrow>
                      <mrow>
                        <mn>0</mn>
                        <mo>&lt;</mo>
                        <mi>j</mi>
                        <mo>&lt;</mo>
                        <mi>n</mi>
                      </mrow>
                    </mfrac>
                  </mrow>
                </munder>
                <mi>P</mi>
                <mo stretchy="false">(</mo>
                <mi>i</mi>
                <mo>,</mo>
                <mi>j</mi>
                <mo stretchy="false">)</mo>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4580/=ex3',
    name: 'TeXbook, 16.2-16.3',
    mathML: `<math display="block">
              <mrow>
                <msup>
                  <mi>x</mi>
                  <mrow>
                    <mn>2</mn>
                    <mi>y</mi>
                  </mrow>
                </msup>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4594/=ex30',
    name: 'TeXbook, 17.8',
    mathML: `<math display="block">
              <mrow>
                <munderover>
                  <mo>∑</mo>
                  <mrow>
                    <mi>i</mi>
                    <mo>=</mo>
                    <mn>1</mn>
                  </mrow>
                  <mi>p</mi>
                </munderover>
                <munderover>
                  <mo>∑</mo>
                  <mrow>
                    <mi>j</mi>
                    <mo>=</mo>
                    <mn>1</mn>
                  </mrow>
                  <mi>q</mi>
                </munderover>
                <munderover>
                  <mo>∑</mo>
                  <mrow>
                    <mi>k</mi>
                    <mo>=</mo>
                    <mn>1</mn>
                  </mrow>
                  <mi>r</mi>
                </munderover>
                <msub>
                  <mi>a</mi>
                  <mrow>
                    <mi>i</mi>
                    <mi>j</mi>
                  </mrow>
                </msub>
                <msub>
                  <mi>b</mi>
                  <mrow>
                    <mi>j</mi>
                    <mi>k</mi>
                  </mrow>
                </msub>
                <msub>
                  <mi>c</mi>
                  <mrow>
                    <mi>k</mi>
                    <mi>i</mi>
                  </mrow>
                </msub>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4595/=ex31',
    name: 'TeXbook, 17.9-17.10',
    mathML: `<math display="block">
              <mrow>
                <msqrt>
                  <mn>1</mn>
                  <mo>+</mo>
                  <msqrt>
                    <mn>1</mn>
                    <mo>+</mo>
                    <msqrt>
                      <mn>1</mn>
                      <mo>+</mo>
                      <msqrt>
                        <mn>1</mn>
                        <mo>+</mo>
                        <msqrt>
                          <mn>1</mn>
                          <mo>+</mo>
                          <msqrt>
                            <mn>1</mn>
                            <mo>+</mo>
                            <msqrt>
                              <mn>1</mn>
                              <mo>+</mo>
                              <mi>x</mi>
                            </msqrt>
                          </msqrt>
                        </msqrt>
                      </msqrt>
                    </msqrt>
                  </msqrt>
                </msqrt>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4596/=ex34',
    name: 'TeXbook, 17.10',
    mathML: `<math display="block">
              <mrow>
                <mrow>
                  <mo>(</mo>
                  <mfrac>
                    <msup>
                      <mo>∂</mo>
                      <mn>2</mn>
                    </msup>
                    <mrow>
                      <mo>∂</mo>
                      <msup>
                        <mi>x</mi>
                        <mn>2</mn>
                      </msup>
                    </mrow>
                  </mfrac>
                  <mo>+</mo>
                  <mfrac>
                    <msup>
                      <mo>∂</mo>
                      <mn>2</mn>
                    </msup>
                    <mrow>
                      <mo>∂</mo>
                      <msup>
                        <mi>y</mi>
                        <mn>2</mn>
                      </msup>
                    </mrow>
                  </mfrac>
                  <mo>)</mo>
                </mrow>
                <msup>
                  <mrow>
                    <mo minsize="150%">|</mo>
                    <mi>φ <!-- \varphi --></mi>
                    <mo stretchy="false">(</mo>
                    <mi>x</mi>
                    <mo>+</mo>
                    <mi mathvariant="normal">i</mi>
                    <mi>y</mi>
                    <mo stretchy="false">)</mo>
                    <mo minsize="150%">|</mo>
                  </mrow>
                  <mn>2</mn>
                </msup>
                <mo>=</mo>
                <mn>0</mn>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4581/=ex4',
    name: 'TeXbook, 16.2-16.3',
    mathML: `<math display="block">
              <mrow>
                <msup>
                  <mn>2</mn>
                  <msup>
                    <mn>2</mn>
                    <msup>
                      <mn>2</mn>
                      <mi>x</mi>
                    </msup>
                  </msup>
                </msup>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4597/=ex40',
    name: 'TeXbook, 18.10-18.11',
    mathML: `<math display="block">
              <mrow>
                <msubsup>
                  <mo stretchy="false">∫</mo>
                  <mn>1</mn>
                  <mi>x</mi>
                </msubsup>
                <mfrac>
                  <mrow><mi>d</mi><mi>t</mi></mrow>
                  <mi>t</mi>
                </mfrac>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4599/=ex41',
    name: 'TeXbook, 18.12-18.13',
    mathML: `<math display="block">
              <mrow>
                <msub>
                  <mo>∬ <!-- int --></mo>
                  <mi>D</mi>
                </msub>
                <mi>d</mi><mi>x</mi>
                <mspace width="thinmathspace"></mspace>
                <mi>d</mi><mi>y</mi>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4600/=ex43',
    name: 'TeXbook, 18.23',
    mathML: `<math display="block">
              <mrow>
                <mi>f</mi>
                <mo stretchy="false">(</mo>
                <mi>x</mi>
                <mo stretchy="false">)</mo>
                <mo>=</mo>
                <mrow>
                  <mo>{</mo>
                  <mtable>
                    <mtr>
                      <mtd columnalign="center">
                        <mrow>
                          <mn>1</mn>
                          <mo>/</mo>
                          <mn>3</mn>
                        </mrow>
                      </mtd>
                      <mtd columnalign="left">
                        <mrow>
                          <mtext>if </mtext>
                          <mn>0</mn>
                          <mo>≤</mo>
                          <mi>x</mi>
                          <mo>≤</mo>
                          <mn>1</mn>
                          <mo>;</mo>
                        </mrow>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd columnalign="center">
                        <mrow>
                          <mn>2</mn>
                          <mo>/</mo>
                          <mn>3</mn>
                        </mrow>
                      </mtd>
                      <mtd columnalign="center">
                        <mrow>
                          <mtext>if </mtext>
                          <mn>3</mn>
                          <mo>≤</mo>
                          <mi>x</mi>
                          <mo>≤</mo>
                          <mn>4</mn>
                          <mo>;</mo>
                        </mrow>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd columnalign="center">
                        <mn>0</mn>
                      </mtd>
                      <mtd columnalign="left">
                        <mtext>elsewhere.</mtext>
                      </mtd>
                    </mtr>
                  </mtable>
                </mrow>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4601/=ex44',
    name: 'TeXbook, 18.23-18.24',
    mathML: `<math display="block">
              <mover>
                <mrow>
                  <mi>x</mi>
                  <mo>+</mo>
                  <mo>...</mo>
                  <mo>+</mo>
                  <mi>x</mi>
                </mrow>
                <mover>
                  <mo>⏞</mo>
                  <mrow><mi>k</mi> <mspace width="thinmathspace"></mspace> <mtext>times</mtext></mrow>
                </mover>
              </mover>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4582/=ex5',
    name: 'TeXbook, 16.2-16.3',
    mathML: `<math display="block">
              <mrow>
                <msub>
                  <mi>y</mi>
                  <msup>
                    <mi>x</mi>
                    <mn>2</mn>
                  </msup>
                </msub>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4602/=ex51',
    name: 'TeXbook, 18.40',
    mathML: `<math display="block">
              <mrow>
                <munder>
                  <mo>∑</mo>
                  <mrow>
                    <mi>p</mi>
                    <mtext> prime</mtext>
                  </mrow>
                </munder>
                <mi>f</mi>
                <mo stretchy="false">(</mo>
                <mi>p</mi>
                <mo stretchy="false">)</mo>
                <mo>=</mo>
                <msub>
                  <mo stretchy="false">∫</mo>
                  <mrow>
                    <mi>t</mi>
                    <mo>&gt;</mo>
                    <mn>1</mn>
                  </mrow>
                </msub>
                <mi>f</mi>
                <mo stretchy="false">(</mo>
                <mi>t</mi>
                <mo stretchy="false">)</mo>
                <mspace width="thinmathspace"></mspace>
                <mi>d</mi>
                <mi>π</mi>
                <mo stretchy="false">(</mo>
                <mi>t</mi>
                <mo stretchy="false">)</mo>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4603/=ex52',
    name: 'TeXbook, 18.41',
    mathML: `<math display="block">
              <mrow>
                <mo stretchy="false">{</mo>
                <munder>
                  <mrow>
                    <mover>
                      <mrow>
                        <mpadded width="0em"><mphantom><mo>(</mo></mphantom></mpadded>
                        <mi>a</mi>
                        <mo>,</mo>
                        <mo>...</mo>
                        <mo>,</mo>
                        <mi>a</mi>
                      </mrow>
                      <mover>
                        <mo>⏞</mo>
                        <mrow>
                          <mi>k</mi>
                          <mtext> </mtext>
                          <mi>a</mi>
                          <mtext>'s</mtext>
                        </mrow>
                      </mover>
                    </mover>
                    <mo>,</mo>
                    <mover>
                      <mrow>
                        <mpadded width="0em"><mphantom><mo>(</mo></mphantom></mpadded>
                        <mi>b</mi>
                        <mo>,</mo>
                        <mo>...</mo>
                        <mo>,</mo>
                        <mi>b</mi>
                      </mrow>
                      <mover>
                        <mo>⏞</mo>
                        <mrow>
                          <mi>ℓ</mi>
                          <mtext> </mtext>
                          <mi>b</mi>
                          <mtext>'s</mtext>
                        </mrow>
                      </mover>
                    </mover>
                  </mrow>
                  <munder>
                    <mo>⏟</mo>
                    <mrow>
                      <mi>k</mi>
                      <mo>+</mo>
                      <mi>ℓ</mi>
                      <mtext> elements</mtext>
                    </mrow>
                  </munder>
                </munder>
                <mo stretchy="false">}</mo>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4604/=ex53',
    name: 'TeXbook, 18.42',
    mathML: `<math display="block">
              <mrow>
                <mo>(</mo>
                <mtable>
                  <mtr>
                    <mtd columnalign="center">
                      <mrow>
                        <mo>(</mo>
                        <mtable>
                          <mtr>
                            <mtd columnalign="center">
                              <mi>a</mi>
                            </mtd>
                            <mtd columnalign="center">
                              <mi>b</mi>
                            </mtd>
                          </mtr>
                          <mtr>
                            <mtd columnalign="center">
                              <mi>c</mi>
                            </mtd>
                            <mtd columnalign="center">
                              <mi>d</mi>
                            </mtd>
                          </mtr>
                        </mtable>
                        <mo>)</mo>
                      </mrow>
                    </mtd>
                    <mtd columnalign="center">
                      <mrow>
                        <mo>(</mo>
                        <mtable>
                          <mtr>
                            <mtd columnalign="center">
                              <mi>e</mi>
                            </mtd>
                            <mtd columnalign="center">
                              <mi>f</mi>
                            </mtd>
                          </mtr>
                          <mtr>
                            <mtd columnalign="center">
                              <mi>g</mi>
                            </mtd>
                            <mtd columnalign="center">
                              <mi>h</mi>
                            </mtd>
                          </mtr>
                        </mtable>
                        <mo>)</mo>
                      </mrow>
                    </mtd>
                  </mtr>
                  <mtr>
                    <mtd columnalign="center">
                      <mn>0</mn>
                    </mtd>
                    <mtd columnalign="center">
                      <mrow>
                        <mo>(</mo>
                        <mtable>
                          <mtr>
                            <mtd columnalign="center">
                              <mi>i</mi>
                            </mtd>
                            <mtd columnalign="center">
                              <mi>j</mi>
                            </mtd>
                          </mtr>
                          <mtr>
                            <mtd columnalign="center">
                              <mi>k</mi>
                            </mtd>
                            <mtd columnalign="center">
                              <mi>l</mi>
                            </mtd>
                          </mtr>
                        </mtable>
                        <mo>)</mo>
                      </mrow>
                    </mtd>
                  </mtr>
                </mtable>
                <mo>)</mo>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4605/=ex54',
    name: 'TeXbook, 18.43',
    mathML: `<math display="block">
              <mrow>
                <mi>det</mi>
                <mo>|</mo>
                <mtable>
                  <mtr>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mn>0</mn>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mn>1</mn>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mn>2</mn>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <mo>…</mo>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mi>n</mi>
                      </msub>
                    </mtd>
                  </mtr>
                  <mtr>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mn>1</mn>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mn>2</mn>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mn>3</mn>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <mo>…</mo>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mrow>
                          <mi>n</mi>
                          <mo>+</mo>
                          <mn>1</mn>
                        </mrow>
                      </msub>
                    </mtd>
                  </mtr>
                  <mtr>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mn>2</mn>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mn>3</mn>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mn>4</mn>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <mo>…</mo>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mrow>
                          <mi>n</mi>
                          <mo>+</mo>
                          <mn>2</mn>
                        </mrow>
                      </msub>
                    </mtd>
                  </mtr>
                  <mtr>
                    <mtd columnalign="center">
                      <mo>⋮</mo>
                    </mtd>
                    <mtd columnalign="center">
                      <mo>⋮</mo>
                    </mtd>
                    <mtd columnalign="center">
                      <mo>⋮</mo>
                    </mtd>
                    <mtd columnalign="center">
                    </mtd>
                    <mtd columnalign="center">
                      <mo>⋮</mo>
                    </mtd>
                  </mtr>
                  <mtr>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mi>n</mi>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mrow>
                          <mi>n</mi>
                          <mo>+</mo>
                          <mn>1</mn>
                        </mrow>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mrow>
                          <mi>n</mi>
                          <mo>+</mo>
                          <mn>2</mn>
                        </mrow>
                      </msub>
                    </mtd>
                    <mtd columnalign="center">
                      <mo>…</mo>
                    </mtd>
                    <mtd columnalign="center">
                      <msub>
                        <mi>c</mi>
                        <mrow>
                          <mn>2</mn>
                          <mi>n</mi>
                        </mrow>
                      </msub>
                    </mtd>
                  </mtr>
                </mtable>
                <mo>|</mo>
                <mo>&gt;</mo>
                <mn>0</mn>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4598/=ex6',
    name: 'TeXbook, 16.2-16.3',
    mathML: `<math display="block">
              <msub>
                <mi>y</mi>
                <msub>
                  <mi>x</mi>
                  <mn>2</mn>
                </msub>
              </msub>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4583/=ex7',
    name: 'TeXbook, 16.4-16.5',
    mathML: `<math display="block">
              <mrow>
                <msubsup>
                  <mi>x</mi>
                  <mn>92</mn>
                  <mn>31415</mn>
                </msubsup>
                <mo>+</mo>
                <mi>π</mi>
              </mrow>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4584/=ex8',
    name: 'TeXbook, 16.4-16.5',
    mathML: `<math display="block">
              <msubsup>
                <mi>x</mi>
                <msubsup>
                  <mi>y</mi>
                  <mi>b</mi>
                  <mi>a</mi>
                </msubsup>
                <msubsup>
                  <mi>z</mi>
                  <mi>c</mi>
                  <mi>d</mi>
                </msubsup>
              </msubsup>
            </math>`
  },
  {
    source: 'https://developer.mozilla.org/@api/deki/files/4585/=ex9',
    name: 'TeXbook, 16.4-16.5',
    mathML: `<math display="block">
              <msubsup>
                <mi>y</mi>
                <mn>3</mn>
                <mo>‴</mo>
              </msubsup>
            </math>`
  },
  {
    source: 'https://mdn.mozillademos.org/files/13402/stirling29',
    name: "Stirling's approximation",
    mathML: `<math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                  <munder>
                      <mo lspace="0em" rspace="0em">lim</mo>
                      <mrow>
                          <mi>n</mi>
                          <mo stretchy="false">→</mo>
                          <mo>+</mo>
                          <mn>∞</mn>
                      </mrow>
                  </munder>
                  <mfrac>
                      <msqrt>
                          <mrow>
                              <mn>2</mn>
                              <mi>π</mi>
                              <mi>n</mi>
                          </mrow>
                      </msqrt>
                      <mrow>
                          <mi>n</mi>
                          <mo>!</mo>
                      </mrow>
                  </mfrac>
                  <msup>
                      <mrow>
                          <mo>(</mo>
                          <mfrac>
                              <mi>n</mi>
                              <mi>e</mi>
                          </mfrac>
                          <mo>)</mo>
                      </mrow>
                      <mi>n</mi>
                  </msup>
              </mrow>
              <mo>=</mo>
              <mn>1</mn>
          </math>`
  },
  {
    source: 'https://mdn.mozillademos.org/files/13438/determinant30',
    name: 'Leibniz formula for the determinant',
    mathML: `<math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                  <mrow>
                      <mo lspace="0em" rspace="0em">det</mo>
                      <mo stretchy="false">(</mo>
                      <mi>A</mi>
                      <mo stretchy="false">)</mo>
                  </mrow>
                  <mo>=</mo>
                  <munder>
                      <mo>∑</mo>
                      <mrow>
                          <mi>σ</mi>
                          <mo>∊</mo>
                          <msub>
                              <mi>S</mi>
                              <mi>n</mi>
                          </msub>
                      </mrow>
                  </munder>
                  <mrow>
                      <mi>ϵ</mi>
                      <mo stretchy="false">(</mo>
                      <mi>σ</mi>
                      <mo stretchy="false">)</mo>
                  </mrow>
                  <mrow>
                      <munderover>
                          <mo>∏</mo>
                          <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <mn>1</mn>
                          </mrow>
                          <mi>n</mi>
                      </munderover>
                      <msub>
                          <mi>a</mi>
                          <mrow>
                              <mi>i</mi>
                              <mo>,</mo>
                              <msub>
                                  <mi>σ</mi>
                                  <mi>i</mi>
                              </msub>
                          </mrow>
                      </msub>
                  </mrow>
              </mrow>
          </math>`
  }
];

export default examples;
