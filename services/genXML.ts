export function fixate(str: string): string {
  const mx = 15;
  if (str.length > mx) {
    const sam = str.substring(0, mx);
    const i = sam.lastIndexOf(" ");
    if (i == -1) {
      return sam + "\n" + fixate(str.substring(mx));
    } else {
      return str.substring(0, i) + "\n" + fixate(str.substring(i));
    }
  } else {
    return str;
  }
}
export function genXML(url: string, label: string): string {
  label = fixate(label);
  return `<?xml version="1.0" encoding="utf-8"?>
    <DesktopLabel Version="1">
      <DYMOLabel Version="3">
        <Description>DYMO Label</Description>
        <Orientation>Portrait</Orientation>
        <LabelName>LargeShipping1763982</LabelName>
        <InitialLength>0</InitialLength>
        <BorderStyle>SolidLine</BorderStyle>
        <DYMORect>
          <DYMOPoint>
            <X>0.0366666</X>
            <Y>0.2333333</Y>
          </DYMOPoint>
          <Size>
            <Width>2.216667</Width>
            <Height>3.706667</Height>
          </Size>
        </DYMORect>
        <BorderColor>
          <SolidColorBrush>
            <Color A="1" R="0" G="0" B="0"></Color>
          </SolidColorBrush>
        </BorderColor>
        <BorderThickness>1</BorderThickness>
        <Show_Border>False</Show_Border>
        <DynamicLayoutManager>
          <RotationBehavior>ClearObjects</RotationBehavior>
          <LabelObjects>
            <QRCodeObject>
              <Name>QRCodeObject0</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="1" R="1" G="1" B="1"></Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <BarcodeFormat>QRCode</BarcodeFormat>
              <Data>
                <DataString>URL:${url}</DataString>
              </Data>
              <HorizontalAlignment>Center</HorizontalAlignment>
              <VerticalAlignment>Middle</VerticalAlignment>
              <Size>AutoFit</Size>
              <EQRCodeType>QRCodeWebPage</EQRCodeType>
              <WebAddressDataHolder>
                <DataString>${url}</DataString>
              </WebAddressDataHolder>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.04705963</X>
                  <Y>0.2433333</Y>
                </DYMOPoint>
                <Size>
                  <Width>2.213248</Width>
                  <Height>2.293008</Height>
                </Size>
              </ObjectLayout>
            </QRCodeObject>
            <TextObject>
              <Name>TextObject0</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="0" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="0" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <HorizontalAlignment>Center</HorizontalAlignment>
              <VerticalAlignment>Middle</VerticalAlignment>
              <FitMode>AlwaysFit</FitMode>
              <IsVertical>False</IsVertical>
              <FormattedText>
                <FitMode>AlwaysFit</FitMode>
                <HorizontalAlignment>Center</HorizontalAlignment>
                <VerticalAlignment>Middle</VerticalAlignment>
                <IsVertical>False</IsVertical>
                <LineTextSpan>
                  <TextSpan>
                    <Text>${label}</Text>
                    <FontInfo>
                      <FontName>Helvetica</FontName>
                      <FontSize>29.9</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"></Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
              </FormattedText>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.05795703</X>
                  <Y>2.536694</Y>
                </DYMOPoint>
                <Size>
                  <Width>2.194368</Width>
                  <Height>1.403312</Height>
                </Size>
              </ObjectLayout>
            </TextObject>
          </LabelObjects>
        </DynamicLayoutManager>
      </DYMOLabel>
      <LabelApplication>Blank</LabelApplication>
      <DataTable>
        <Columns></Columns>
        <Rows></Rows>
      </DataTable>
    </DesktopLabel>`;
}
