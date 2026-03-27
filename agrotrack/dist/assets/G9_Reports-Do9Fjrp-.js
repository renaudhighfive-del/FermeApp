import{j as H,c as n,a as e,t as l,h as f,A as N,B as I,w as y,q as O,F as Q,k as J,n as R,x as w,e as h,g as x,D as G,r as $,l as k,C as K,o as r}from"./index-DYA4v314.js";import{u as W}from"./gerant-BrPdrbO0.js";import{b as A,f as p}from"./formatters-DySSlrZU.js";import"./api-YgYn_ijs.js";const X={class:"page-header"},Y={class:"page-header-row"},Z={key:0,class:"page-subtitle"},tt={key:1,class:"page-subtitle"},et={class:"page-actions"},st=["disabled"],ot={key:0,class:"card",style:{"text-align":"center",padding:"40px"}},lt={key:1,class:"card",style:{"text-align":"center",padding:"40px"}},at={key:2,class:"grid-2 mb-gap",style:{"align-items":"start"}},nt={class:"card mb-gap"},rt={class:"form-group"},it=["value"],dt={class:"form-group"},ut={class:"filter-group w-full"},pt={class:"form-group"},ct={class:"flex flex-col gap-8",style:{"font-size":"13px"}},ft={class:"flex items-center gap-8"},vt={class:"flex items-center gap-8"},mt={class:"flex items-center gap-8"},gt={class:"flex items-center gap-8"},bt={class:"flex items-center gap-8"},yt=["disabled"],xt={key:0,width:"14",height:"14",fill:"none",stroke:"currentColor","stroke-width":"1.5",viewBox:"0 0 24 24"},wt={class:"report-preview"},ht={class:"report-preview-header"},$t={class:"report-preview-title"},kt={class:"report-preview-sub"},Ct={key:0,class:"report-block"},_t={class:"report-stat-row"},At={class:"fw-600"},zt={class:"report-stat-row"},St={class:"fw-600",style:{color:"var(--success)"}},Pt={class:"report-stat-row"},Dt={class:"fw-600"},Rt={class:"report-stat-row"},Tt={class:"fw-600",style:{color:"var(--danger)"}},Bt={key:1,class:"report-block"},Mt={class:"report-stat-row"},Ft={class:"fw-600"},Gt={class:"report-stat-row"},Vt={class:"fw-600 text-danger"},Et={class:"report-stat-row"},Lt={class:"report-stat-row"},jt={key:2,class:"report-block"},Ut={class:"report-stat-row"},qt={class:"fw-600 text-success"},Ht={class:"report-stat-row"},Nt={class:"fw-600 text-danger"},It={class:"report-stat-row"},Ot={class:"fw-600 text-danger"},Qt={key:3,class:"report-block"},Jt={class:"report-stat-row"},Kt={class:"fw-600"},Wt={class:"report-stat-row"},Xt={class:"fw-600"},Yt={class:"report-stat-row"},Zt={class:"fw-600"},ae={__name:"G9_Reports",setup(te){const z=W(),v=k(()=>z.activeCampaigns),g=$(""),S=$(!1),s=k(()=>g.value?v.value.find(i=>(i._id||i.id)===g.value)||v.value[0]||null:v.value[0]||null),m=$(!1),b=$("campaign"),a=$({animals:!0,finance:!0,health:!0,feed:!0,sales:!1});H(async()=>{await V()});async function V(){S.value=!0;try{await z.fetchGerantFarms(),await z.fetchGerantCampaigns(),v.value.length>0&&!g.value&&(g.value=v.value[0]._id||v.value[0].id)}catch(i){console.error("Erreur lors du chargement des données:",i)}finally{S.value=!1}}const T=k(()=>!s.value||s.value.initialAnimalCount===0?0:Math.round(s.value.currentAnimalCount/s.value.initialAnimalCount*100)),B=k(()=>!s.value||s.value.currentAnimalCount===0?0:Math.round((s.value.currentAnimalCount-s.value.deaths)/s.value.currentAnimalCount*100)),P=k(()=>s.value?s.value.actualRevenue-s.value.spent:0);function E(){return new Promise((i,t)=>{if(window.html2pdf)return i(window.html2pdf);const c=document.createElement("script");c.src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",c.onload=()=>i(window.html2pdf),c.onerror=t,document.head.appendChild(c)})}async function M(){if(s.value){m.value=!0;try{const i=await E(),t=s.value,c=A(new Date),o=P.value,D=o>=0?"#16a34a":"#dc2626",L=o>=0?"Bénéfice net":"Perte nette",F=t.budget>0?Math.min(100,Math.round(t.spent/t.budget*100)):0,C="font-size: 16px; font-weight: bold; color: #14532d; border-bottom: 2px solid #14532d; padding-bottom: 5px; margin-bottom: 15px; margin-top: 25px; display: block;",_="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #ffffff;",d="padding: 10px; border: 1px solid #e2e8f0; color: #64748b; font-size: 12px; background-color: #f8fafc;",u="padding: 10px; border: 1px solid #e2e8f0; color: #1a202c; font-size: 12px; font-weight: bold; text-align: right; background-color: #ffffff;",j=`
      <div style="padding: 40px; font-family: Arial, Helvetica, sans-serif; color: #1a202c; background-color: #ffffff; width: 700px; min-height: 1000px; box-sizing: border-box;">
        <!-- Header with Logo -->
        <div style="background-color: #14532d; color: #ffffff; padding: 30px; border-radius: 8px; margin-bottom: 30px; display: block; position: relative;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#86efac" stroke-width="2">
              <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9S3 15.97 3 11a9 9 0 0 1 9-9z"/>
              <path d="M12 6c-2.5 1-4 3.5-4 5.5 0 2.5 1.8 4.5 4 4.5s4-2 4-4.5c0-2-1.5-4.5-4-5.5z"/>
            </svg>
            <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; color: #86efac;">AgroTrack</span>
          </div>
          <div style="font-size: 28px; font-weight: bold; margin-bottom: 5px; color: #ffffff;">Rapport de Campagne</div>
          <div style="font-size: 18px; color: #86efac;">${t.name}</div>
          
          <table style="width: 100%; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; border-collapse: collapse;">
            <tr>
              <td style="font-size: 11px; color: #ffffff; background-color: transparent; border: none; padding: 5px;"><strong>Généré le:</strong> ${c}</td>
              <td style="font-size: 11px; color: #ffffff; text-align: center; background-color: transparent; border: none; padding: 5px;"><strong>Statut:</strong> ${t.status}</td>
              <td style="font-size: 11px; color: #ffffff; text-align: right; background-color: transparent; border: none; padding: 5px;"><strong>Période:</strong> ${A(t.startDate)} - ${t.endDate?A(t.endDate):"En cours"}</td>
            </tr>
          </table>
        </div>

        <!-- Sections wrapper -->
        <div style="display: block; width: 100%;">
          <!-- Section: Performances -->
          ${a.value.animals?`
            <div style="${C}">📈 Performances de l'Élevage</div>
            <table style="${_}">
              <tr>
                <td style="${d}">Effectif initial</td>
                <td style="${u}">${t.initialAnimalCount} têtes</td>
                <td style="${d}">Effectif actuel</td>
                <td style="${u}">${t.currentAnimalCount} têtes</td>
              </tr>
              <tr>
                <td style="${d}">Taux de survie</td>
                <td style="${u}">${T.value}%</td>
                <td style="${d}">Taux de mortalité</td>
                <td style="${u}">${t.mortality}%</td>
              </tr>
            </table>
          `:""}

          <!-- Section: Finance -->
          ${a.value.finance?`
            <div style="${C}">💰 Bilan Financier</div>
            <table style="${_}">
              <tr>
                <td style="${d}">Budget total alloué</td>
                <td style="${u}">${p(t.budget)}</td>
              </tr>
              <tr>
                <td style="${d}">Total des dépenses</td>
                <td style="${u}; color: #dc2626;">- ${p(t.spent)}</td>
              </tr>
              <tr>
                <td style="${d}">Total des revenus</td>
                <td style="${u}; color: #16a34a;">+ ${p(t.actualRevenue)}</td>
              </tr>
              <tr style="background-color: ${o>=0?"#f0fdf4":"#fef2f2"};">
                <td style="padding: 15px; border: 2px solid ${D}; font-weight: bold; font-size: 14px;">${L}</td>
                <td style="padding: 15px; border: 2px solid ${D}; font-weight: bold; font-size: 16px; text-align: right; color: ${D};">
                  ${p(o)}
                </td>
              </tr>
            </table>
            <div style="margin-top: 10px; background-color: #f8fafc; padding: 15px; border-radius: 8px; display: block; border: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">Utilisation du budget (${F}%)</div>
              <div style="width: 100%; height: 12px; background-color: #e2e8f0; border-radius: 6px; overflow: hidden;">
                <div style="width: ${F}%; height: 100%; background-color: #dc2626;"></div>
              </div>
            </div>
          `:""}

          <!-- Section: Santé -->
          ${a.value.health?`
            <div style="${C}">🩺 État Sanitaire</div>
            <table style="${_}">
              <tr>
                <td style="${d}">Animaux en bonne santé</td>
                <td style="${u}; color: #16a34a;">${t.currentAnimalCount-t.deaths} (${B.value}%)</td>
              </tr>
              <tr>
                <td style="${d}">Pertes (Mortalité)</td>
                <td style="${u}; color: #dc2626;">${t.deaths} têtes</td>
              </tr>
            </table>
          `:""}

          <!-- Section: Alimentation -->
          ${a.value.feed?`
            <div style="${C}">🌾 Alimentation & Conversion</div>
            <table style="${_}">
              <tr>
                <td style="${d}">Quantité totale consommée</td>
                <td style="${u}">${t.feedConsumed||0} kg</td>
              </tr>
              <tr>
                <td style="${d}">Coût total de l'aliment</td>
                <td style="${u}">${p(t.feedCost||0)}</td>
              </tr>
              <tr>
                <td style="${d}">Indice de Conversion (FCR)</td>
                <td style="${u}">${t.fcr||"N/A"}</td>
              </tr>
            </table>
          `:""}
        </div>

        <!-- Footer -->
        <div style="margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 10px; display: block;">
          Document généré automatiquement par AgroTrack - Logiciel de gestion agricole.<br>
          © 2026 AgroTrack - Tous droits réservés.
        </div>
      </div>
    `,U=`rapport-${t.name.toLowerCase().replace(/\s+/g,"-")}-${new Date().toISOString().slice(0,10)}.pdf`,q={margin:[10,10,10,10],filename:U,image:{type:"jpeg",quality:1},html2canvas:{scale:2,useCORS:!0,logging:!0,backgroundColor:"#ffffff"},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};await i().from(j).set(q).save()}catch(i){console.error("Erreur génération PDF:",i),alert("Erreur lors de la génération du rapport PDF")}finally{m.value=!1}}}return(i,t)=>{const c=K("RouterLink");return r(),n("div",null,[e("div",X,[e("div",Y,[e("div",null,[t[9]||(t[9]=e("h1",{class:"page-title"},"Rapports",-1)),s.value?(r(),n("p",Z,"Campagne "+l(s.value.name),1)):(r(),n("p",tt,"Générez et exportez vos rapports"))]),e("div",et,[e("button",{class:"btn btn-primary",onClick:M,disabled:!s.value||m.value},[t[10]||(t[10]=e("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor","stroke-width":"1.5",viewBox:"0 0 24 24"},[e("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e("polyline",{points:"7 10 12 15 17 10"}),e("line",{x1:"12",y1:"15",x2:"12",y2:"3"})],-1)),f(" "+l(m.value?"Génération...":"Générer PDF"),1)],8,st)])])]),S.value?(r(),n("div",ot,[...t[11]||(t[11]=[e("p",{class:"text-soft"},"Chargement...",-1)])])):s.value?(r(),n("div",at,[e("div",null,[e("div",nt,[t[23]||(t[23]=e("div",{class:"card-title"},"Paramètres du rapport",-1)),e("div",rt,[t[14]||(t[14]=e("label",{class:"form-label"},"Campagne",-1)),y(e("select",{class:"form-select","onUpdate:modelValue":t[0]||(t[0]=o=>g.value=o)},[(r(!0),n(Q,null,J(v.value,o=>(r(),n("option",{key:o._id||o.id,value:o._id||o.id},l(o.name),9,it))),128))],512),[[O,g.value]])]),e("div",dt,[t[15]||(t[15]=e("label",{class:"form-label"},"Période",-1)),e("div",ut,[e("button",{class:R(["filter-btn",{active:b.value==="month"}]),onClick:t[1]||(t[1]=o=>b.value="month"),style:{flex:"1"}},"Mois",2),e("button",{class:R(["filter-btn",{active:b.value==="quarter"}]),onClick:t[2]||(t[2]=o=>b.value="quarter"),style:{flex:"1"}},"Trimestre",2),e("button",{class:R(["filter-btn",{active:b.value==="campaign"}]),onClick:t[3]||(t[3]=o=>b.value="campaign"),style:{flex:"1"}},"Campagne",2)])]),e("div",pt,[t[21]||(t[21]=e("label",{class:"form-label"},"Sections à inclure",-1)),e("div",ct,[e("label",ft,[y(e("input",{type:"checkbox","onUpdate:modelValue":t[4]||(t[4]=o=>a.value.animals=o)},null,512),[[w,a.value.animals]]),t[16]||(t[16]=f(" Performances animaux",-1))]),e("label",vt,[y(e("input",{type:"checkbox","onUpdate:modelValue":t[5]||(t[5]=o=>a.value.finance=o)},null,512),[[w,a.value.finance]]),t[17]||(t[17]=f(" Bilan financier",-1))]),e("label",mt,[y(e("input",{type:"checkbox","onUpdate:modelValue":t[6]||(t[6]=o=>a.value.health=o)},null,512),[[w,a.value.health]]),t[18]||(t[18]=f(" Résumé santé",-1))]),e("label",gt,[y(e("input",{type:"checkbox","onUpdate:modelValue":t[7]||(t[7]=o=>a.value.feed=o)},null,512),[[w,a.value.feed]]),t[19]||(t[19]=f(" Consommation aliments",-1))]),e("label",bt,[y(e("input",{type:"checkbox","onUpdate:modelValue":t[8]||(t[8]=o=>a.value.sales=o)},null,512),[[w,a.value.sales]]),t[20]||(t[20]=f(" Détail ventes",-1))])])]),e("button",{class:"btn btn-primary btn-full",onClick:M,disabled:m.value},[m.value?h("",!0):(r(),n("svg",xt,[...t[22]||(t[22]=[e("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"},null,-1),e("polyline",{points:"7 10 12 15 17 10"},null,-1),e("line",{x1:"12",y1:"15",x2:"12",y2:"3"},null,-1)])])),f(" "+l(m.value?"Génération en cours...":"Générer le rapport PDF"),1)],8,yt)])]),e("div",wt,[e("div",ht,[e("div",$t,"Rapport — "+l(s.value.name),1),e("div",kt,"Généré le "+l(x(A)(new Date))+" · AgroTrack",1)]),a.value.animals?(r(),n("div",Ct,[t[28]||(t[28]=e("div",{class:"report-block-title"},"Performances animaux",-1)),e("div",_t,[t[24]||(t[24]=e("span",null,"Effectif initial",-1)),e("span",At,l(s.value.initialAnimalCount),1)]),e("div",zt,[t[25]||(t[25]=e("span",null,"Effectif actuel",-1)),e("span",St,l(s.value.currentAnimalCount),1)]),e("div",Pt,[t[26]||(t[26]=e("span",null,"Taux de survie",-1)),e("span",Dt,l(T.value)+"%",1)]),e("div",Rt,[t[27]||(t[27]=e("span",null,"Taux de mortalité",-1)),e("span",Tt,l(s.value.mortality)+"%",1)])])):h("",!0),a.value.finance?(r(),n("div",Bt,[t[33]||(t[33]=e("div",{class:"report-block-title"},"Bilan financier",-1)),e("div",Mt,[t[29]||(t[29]=e("span",null,"Budget alloué",-1)),e("span",Ft,l(x(p)(s.value.budget)),1)]),e("div",Gt,[t[30]||(t[30]=e("span",null,"Total dépenses",-1)),e("span",Vt,l(x(p)(s.value.spent)),1)]),e("div",Et,[t[31]||(t[31]=e("span",null,"Total revenus",-1)),e("span",{class:"fw-600",style:G({color:s.value.actualRevenue>0?"var(--success)":"var(--soft)"})},l(x(p)(s.value.actualRevenue)),5)]),e("div",Lt,[t[32]||(t[32]=e("span",null,"Résultat net",-1)),e("span",{class:"fw-600",style:G({color:P.value>=0?"var(--success)":"var(--danger)"})},l(x(p)(P.value)),5)])])):h("",!0),a.value.health?(r(),n("div",jt,[t[37]||(t[37]=e("div",{class:"report-block-title"},"Résumé santé",-1)),e("div",Ut,[t[34]||(t[34]=e("span",null,"Animaux sains",-1)),e("span",qt,l(s.value.currentAnimalCount-s.value.deaths)+" ("+l(B.value)+"%)",1)]),e("div",Ht,[t[35]||(t[35]=e("span",null,"Décès",-1)),e("span",Nt,l(s.value.deaths),1)]),e("div",It,[t[36]||(t[36]=e("span",null,"Pertes totales",-1)),e("span",Ot,l(s.value.deaths)+" ("+l(s.value.mortality)+"%)",1)])])):h("",!0),a.value.feed?(r(),n("div",Qt,[t[41]||(t[41]=e("div",{class:"report-block-title"},"Consommation aliments",-1)),e("div",Jt,[t[38]||(t[38]=e("span",null,"Aliments consommés",-1)),e("span",Kt,l(s.value.feedConsumed)+" kg",1)]),e("div",Wt,[t[39]||(t[39]=e("span",null,"Coût alimentation",-1)),e("span",Xt,l(x(p)(s.value.feedCost)),1)]),e("div",Yt,[t[40]||(t[40]=e("span",null,"Indice de conversion",-1)),e("span",Zt,l(s.value.fcr),1)])])):h("",!0)])])):(r(),n("div",lt,[t[13]||(t[13]=e("p",{class:"text-soft",style:{"font-size":"16px"}},"Aucune campagne active",-1)),N(c,{to:"/gerant/campaigns",class:"btn btn-primary",style:{"margin-top":"20px"}},{default:I(()=>[...t[12]||(t[12]=[f("Voir les campagnes",-1)])]),_:1})]))])}}};export{ae as default};
