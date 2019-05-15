//materiales sacados de tabla
var material_brass = new Material();
material_brass.set_k_ambient([0.329412,0.223529,0.027451]);
material_brass.set_k_diffuse([0.780392,0.568627,0.113725]);
material_brass.set_k_spec([0.992157,0.941176,0.807843]);
material_brass.set_exp_spec(27.8974);
material_brass.set_f0(0.99);
material_brass.set_m(0.09);
material_brass.set_alpha_x(0.2);
material_brass.set_alpha_y(0.7);

var material_bronze = new Material();
material_bronze.set_k_ambient([0.21,0.12,0.05]);
material_bronze.set_k_diffuse([0.71,0.42,0.18]);
material_bronze.set_k_spec([0.39,0.27,0.16]);
material_bronze.set_exp_spec(25.6);
material_bronze.set_f0(0.99);
material_bronze.set_m(0.14);
material_bronze.set_alpha_x(0.1);
material_bronze.set_alpha_y(0.9);

var material_copper = new Material();//pulido
material_copper.set_k_ambient([0.22,0.08,0.02]);
material_copper.set_k_diffuse([0.55,0.21,0.06]);
material_copper.set_k_spec([0.58,0.22,0.06]);
material_copper.set_exp_spec(51);
material_copper.set_f0(0.99);
material_copper.set_m(0.14);
material_copper.set_alpha_x(0.3);
material_copper.set_alpha_y(0.9);

var material_iron = new Material(); //hierro fundido
material_iron.set_k_ambient([0.01,0.01,0.01]);
material_iron.set_k_diffuse([0.2,0.2,0.2]);
material_iron.set_k_spec([0.9,0.9,0.9]);
material_iron.set_exp_spec(25.6);
material_iron.set_f0(0.6);
material_iron.set_m(0.15);
material_iron.set_alpha_x(0.3);
material_iron.set_alpha_y(0.6);

var material_ceramico = new Material();
material_ceramico.set_k_ambient([0.25,0.148,0.06475]);
material_ceramico.set_k_diffuse([0.4,0.2368,0.1036]);
material_ceramico.set_k_spec([0.774597,0.458561,0.200621]);
material_ceramico.set_exp_spec(7.8974);
material_ceramico.set_f0(0.05);
material_ceramico.set_m(0.95);
material_ceramico.set_alpha_x(0.4);
material_ceramico.set_alpha_y(0.4);

var material_gold = new Material();
material_gold.set_k_ambient([0.24725,0.1995,0.0745]);
material_gold.set_k_diffuse([0.75164,0.60648,0.22648]);
material_gold.set_k_spec([0.628281,0.555802,0.366065]);
material_gold.set_exp_spec(51.2);
material_gold.set_f0(0.99);
material_gold.set_m(0.14);
material_gold.set_alpha_x(0.4);
material_gold.set_alpha_y(0.4);

var material_blackplastic = new Material();
material_blackplastic.set_k_ambient([0.0,0.0,0.0]);
material_blackplastic.set_k_diffuse([0.01,0.01,0.01]);
material_blackplastic.set_k_spec([0.5,0.5,0.5]);
material_blackplastic.set_exp_spec(32.0);
material_blackplastic.set_f0(0.06);
material_blackplastic.set_m(0.08);
material_blackplastic.set_alpha_x(0.4);
material_blackplastic.set_alpha_y(0.4);

var material_redplastic = new Material();
material_redplastic.set_k_ambient([0.2,0,0]);
material_redplastic.set_k_diffuse([0.8,0,0]);
material_redplastic.set_k_spec([0.8,0.2,0.2]);
material_redplastic.set_exp_spec(46.8);
material_redplastic.set_f0(0.04);
material_redplastic.set_m(0.05);
material_redplastic.set_alpha_x(0.1);
material_redplastic.set_alpha_y(0.5);

var material_silver = new Material();
material_silver.set_k_ambient([0.19225,0.19225,0.19225]);
material_silver.set_k_diffuse([0.50754,0.50754,0.50754]);
material_silver.set_k_spec([0.508273,0.508273,0.508273]);
material_silver.set_exp_spec(51.2);
material_silver.set_f0(0.99);
material_silver.set_m(0.14);
material_silver.set_alpha_x(0.4);
material_silver.set_alpha_y(0.4);

var material_pearl = new Material();
material_pearl.set_k_ambient([0.25,0.20725,0.20725]);
material_pearl.set_k_diffuse([1.0,0.829,0.829]);
material_pearl.set_k_spec([0.296648,0.296648,0.296648]);
material_pearl.set_exp_spec(11.264);
material_pearl.set_f0(0.02);
material_pearl.set_m(0.03);
material_pearl.set_alpha_x(0.4);
material_pearl.set_alpha_y(0.4);

//material para el plano, totalmente difuso sin especularidad
var material_plano = new Material();
material_plano.set_k_ambient([0.2,0.2,0.2]);
material_plano.set_k_diffuse([0.5,0.5,0.5]);
material_plano.set_k_spec([0.0,0.0,0.0]);
material_plano.set_exp_spec(1.0);
material_plano.set_f0(0.01);
material_plano.set_m(0.99);
material_plano.set_alpha_x(0.4);
material_plano.set_alpha_y(0.4);
