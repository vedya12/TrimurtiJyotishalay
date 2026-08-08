/**
 * Digital Sankalp Templates Module
 * Contains Sanskrit/Marathi ritual templates with dynamic tags.
 */

window.SankalpTemplates = {
  // Satyanarayan Puja Template
  satyanarayan: `
    <p><strong>श्री गणेशाय नमः ॥ श्रीमन्महागणाधिपतये नमः ॥</strong></p>
    <p>
      विष्णुविष्णुर्विष्णुः श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य अद्य एतस्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमचरणे जम्बूद्वीपे भारतवर्षे महाराष्ट्रदेशे पुण्यक्षेत्रे, 
      <span class="doc-variable">{{sankalpDateSanskrit}}</span>.
    </p>
    <p>
      अमुक गोत्रोत्पन्नस्य <span class="doc-variable">{{gotra}}</span> गोत्रस्य, 
      नक्षत्र: <span class="doc-variable">{{nakshatra}}</span>, 
      श्री <span class="doc-variable">{{name}}</span> (पिता: श्री <span class="doc-variable">{{fatherName}}</span>) 
      मम सपरिवारस्य सकलमनोरथ सिद्ध्यर्थं, 
      <span class="doc-variable">{{purpose}}</span> प्राप्त्यर्थं, 
      तथा च सर्वविघ्न निवारणार्थं <strong>श्री सत्यनारायण स्वामी प्रीत्यर्थं</strong> यथाशक्ती पूजनादिकं कर्माहं करिष्ये ॥
    </p>
  `,

  // Vastu Shanti Template
  vastu: `
    <p><strong>ॐ वास्तोषपते प्रति जानीह्यस्मान् स्वावेशो अनमीवो भवा नः ॥</strong></p>
    <p>
      अद्य पूर्वोच्चारित गृहस्थस्य <span class="doc-variable">{{name}}</span> (गोत्र: <span class="doc-variable">{{gotra}}</span>) 
      नवीन गृहप्रवेश निमित्ते वास्तू दोष निवारणार्थं, गृह-स्थैर्य-समृद्धि सिद्धये, 
      स्थान स्थान देवता प्रीत्यर्थं <strong>वास्तुशांति विधान पूजनं</strong> करिष्ये ॥
    </p>
  `,

  // Rudrabhishek Template
  rudrabhishek: `
    <p><strong>ॐ नमः शिवाय ॥</strong></p>
    <p>
      अद्य श्री परमेश्वर प्रीत्यर्थं, आयुरारोग्य ऐश्वर्य प्राप्तिमस्तु, सकल पाप क्षयार्थं, 
      <span class="doc-variable">{{name}}</span> (गोत्र: <span class="doc-variable">{{gotra}}</span>, नक्षत्र: <span class="doc-variable">{{nakshatra}}</span>) 
      सपरिवारस्य <strong>श्री रुद्रामिषेक पूजनं व विधी</strong> सम्पादयामि ॥
    </p>
  `,

  // General Puja Template
  general: `
    <p><strong>श्री कुलदेवताभ्यो नमः ॥</strong></p>
    <p>
      अद्य एतस्मिन् शुभ दिने, <span class="doc-variable">{{name}}</span> (पिता: श्री <span class="doc-variable">{{fatherName}}</span>), 
      गोत्र: <span class="doc-variable">{{gotra}}</span>, 
      स्थान: <span class="doc-variable">{{venue}}</span> मध्ये 
      <span class="doc-variable">{{puja}}</span> विधी संकल्पं समाचरिष्ये ॥
    </p>
  `
};